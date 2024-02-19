window.renderMonthly = true;
window.renderWeekly = false;
window.renderDaily = false;

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
      if (arg.view.type === "dayGridMonth" && window.renderMonthly) {
        return { html: `<b>${arg.event.title}</b>` };
      } else if (arg.view.type === "timeGridWeek" && window.renderWeekly) {
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
      } else if (arg.view.type === "timeGridDay" && window.renderDaily) {
        const startTime = new Date(arg.event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(arg.event.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          html: `<b>${startTime} - ${endTime}</b><br>${arg.event.title} assigned to ${arg.event.extendedProps.assignee}`,
        };
      }
    },
    // Event listener for month, week, daily view buttons
    datesSet: function (info) {
      switch (info.view.type) {
        case "dayGridMonth":
          window.renderMonthly = true;
          window.renderWeekly = false;
          window.renderDaily = false;
          break;
        case "timeGridWeek":
          window.renderMonthly = false;
          window.renderWeekly = true;
          window.renderDaily = false;
          break;
        case "timeGridDay":
          window.renderMonthly = false;
          window.renderWeekly = false;
          window.renderDaily = true;
          break;
        default:
          break;
      }

      calendar.render();
    },
  });

  const tasks = await logMovies();
  var due_times = [];
  var due_days = [];
  var task_titles = [];
  var task_assignees = [];
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

  const dayCounts = {};
  due_days.forEach((date) => {
    if (dayCounts[date]) {
      dayCounts[date]++;
    } else {
      dayCounts[date] = 1;
    }
  });

  for (const [date, count] of Object.entries(dayCounts)) {
    var t = "tasks";
    if (count == 1) {
      t = "task";
    }
    calendar.addEvent({
      title: `${count} ` + t,
      start: date,
      allDay: true,
    });
  }

  // // weekly view
  // for (let i = 0; i < due_times.length; i++) {
  //   calendar.addEvent({
  //     title: task_titles[i],
  //     start: due_times[i],
  //     allDay: false,
  //   });
  // }

  // // daily view
  // for (let i = 0; i < due_times.length; i++) {
  //   calendar.addEvent({
  //     title: task_titles[i] + " assigned to " + task_assignees[i],
  //     start: due_times[i],
  //     allDay: false,
  //   });
  // }
  calendar.render();
});

async function logMovies() {
  const houseCalendar = document.getElementById("calendar");
  const houseID = houseCalendar.getAttribute("data-house-id");
  const response = await fetch("/get-tasks/" + houseID);
  const movies = await response.json();
  console.log(movies);
  return movies;
}
