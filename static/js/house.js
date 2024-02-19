
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
        // For monthly view, just show count, but this requires pre-processing
        // Since eventContent doesn't directly support aggregation, you might need to implement
        // a custom logic outside of FullCalendar to track and display aggregated counts.
        // This example shows a simple title modification.
        return { html: `<b>${arg.event.title}</b>` }; // Placeholder for aggregated titles
      } else {
        // For weekly and daily views, show detailed time and title
        const startTime = new Date(arg.event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(arg.event.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          html: `<b>${startTime} - ${endTime}</b><br>${arg.event._def.title}`,
        };
      }
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
  // console.log(due_days);
  // console.log(due_times);
  const dayCounts = {};
  due_days.forEach(date => {
    if (dayCounts[date]) {
      dayCounts[date]++;
    } else {
      dayCounts[date] = 1;
    }
  });

  // monthly view
  for (const [date, count] of Object.entries(dayCounts)) {
    calendar.addEvent({
      title: `${count} task(s)`,
      start: date,
      allDay: true,
    });
    // console.log(date)
    // console.log(count)
  }
  
  // weekly view
  for (let i = 0; i < due_times.length; i++) {
    calendar.addEvent({
      title: task_titles[i],
      start: due_times[i],
      allDay: false,
    });
  }

  // daily view
  for (let i = 0; i < due_times.length; i++) {
    calendar.addEvent({
      title: task_titles[i] + " assigned to " + task_assignees[i],
      start: due_times[i],
      allDay: false,
    });
  }

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
