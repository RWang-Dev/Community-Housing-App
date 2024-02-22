document.addEventListener("DOMContentLoaded", async function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: "UTC",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay", // Buttons for monthly, weekly, and daily views
    },
    eventContent: function (arg) {
      // Decide content based on the view
      if (arg.view.type === "dayGridMonth") {
        return { html: `<b>${arg.event.title}</b>` };
      } else if (arg.view.type === "timeGridWeek") {
        return { html: `${arg.event.title}` };
      } else if (arg.view.type === "timeGridDay") {
        const startTime = new Date(arg.event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(arg.event.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          html: `<b>${startTime} - ${endTime}</b><br>${arg.event.title}`,
        };
      }
    },
    // Event listener for month, week, daily view buttons
    datesSet: function (info) {
      switch (info.view.type) {
        case "dayGridMonth":
          refreshCalendar(calendar);
          addMonthEvents(calendar);
          break;
        case "timeGridWeek":
          refreshCalendar(calendar);
          addWeekEvents(calendar);
          break;
        case "timeGridDay":
          refreshCalendar(calendar);
          addDayEvents(calendar);
          break;
        default:
          break;
      }
    },
  });
  calendar.render();
});

async function addMonthEvents(calendar) {
  const tasks = await logMovies();
  const { due_times, due_days } = extractTaskInfo(tasks);
  const dayCounts = countDays(due_days);

  for (const [date, count] of Object.entries(dayCounts)) {
    let t;
    if (count === 1) {
      t = "task";
    } 
    else {
      t = "tasks";
    }
    calendar.addEvent({
      title: `${count} ${t}`,
      start: date,
      allDay: true,
    });
  }
}

async function addDayEvents(calendar) {
  const tasks = await logMovies();
  const { due_times, due_days, task_titles, task_assignees } = extractTaskInfo(tasks);

  for (let i = 0; i < task_titles.length; i++) {
    calendar.addEvent({
      title: `${task_titles[i]} assigned to ${task_assignees[i]}`,
      start: due_times[i],
      allDay: false,
    });
  }
}

async function addWeekEvents(calendar) {
  const tasks = await logMovies();
  const { due_times, due_days, task_titles } = extractTaskInfo(tasks);

  for (let i = 0; i < task_titles.length; i++) {
    calendar.addEvent({
      title: task_titles[i],
      start: due_times[i],
      allDay: false,
    });
  }
}

function extractTaskInfo(tasks) {
  const due_times = [];
  const due_days = [];
  const task_titles = [];
  const task_assignees = [];
  
  for (var i = 0; i < tasks.length; i++) {
    t_time = tasks[i]["end"];
    t_day = tasks[i]["end-day"];
    const parsedTime = new Date(t_time);
    const parsedDay = new Date(t_day);
    due_times.push(parsedTime.toISOString());
    due_days.push(parsedDay.toISOString().split("T")[0]);
    task_titles.push(tasks[i]["title"]);
    task_assignees.push(tasks[i]["assignee"]);
  }

  return { due_times, due_days, task_titles, task_assignees };
}

function countDays(due_days) {
  const dayCounts = {};
  due_days.forEach((date) => {
    if (dayCounts[date]) {
      dayCounts[date] += 1;
    } 
    else {
      dayCounts[date] = 1;
    }
  });
  return dayCounts;
}

function refreshCalendar(calendar) {
  calendar.getEvents().forEach((event) => event.remove());
}

async function logMovies() {
  const houseCalendar = document.getElementById("calendar");
  const houseID = houseCalendar.getAttribute("data-house-id");
  const response = await fetch("/get-tasks/" + houseID);
  const movies = await response.json();
  // console.log(movies);
  return movies;
}
