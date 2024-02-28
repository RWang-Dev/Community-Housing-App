window.renderMonthly = true;
window.renderWeekly = false;
window.renderDaily = false;

document.addEventListener("DOMContentLoaded", async function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
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
        return { html: `<b>${arg.event.title}</b>` };
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
          html: `<b>${startTime} - ${endTime}</b><br>${arg.event.title}`,
        };
      }
    },
    // Event listener for month, week, daily view buttons
    datesSet: function (info) {
      switch (info.view.type) {
        case "dayGridMonth":
          calendar.removeAllEvents();
          for (const date in dayCounts) {
            const count = dayCounts[date];
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
          window.renderMonthly = true;
          window.renderWeekly = false;
          window.renderDaily = false;
          break;
        case "timeGridWeek":
          calendar.removeAllEvents();
          for (const date in dayCounts) {
            const count = dayCounts[date];
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
          window.renderMonthly = false;
          window.renderWeekly = true;
          window.renderDaily = false;
          break;
        case "timeGridDay":
          calendar.removeAllEvents();
          for (let i = 0; i < due_times.length; i++) {
            let isoString = due_times[i];
            let date = new Date(isoString);
            date.setTime(date.getTime() + 1 * 60 * 60 * 1000);
            let end_time = date.toISOString();

            calendar.addEvent({
              title: task_titles[i] + " assigned to " + task_assignees[i],
              start: due_times[i],
              end: end_time,
              allDay: false,
            });
          }
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
    const parsedTime = convertTime(t_time);
    due_times.push(parsedTime.toISOString());
    due_days.push(parsedTime.toISOString().split("T")[0]);
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
  calendar.render();
});

async function logMovies() {
  const houseCalendar = document.getElementById("calendar");
  const houseID = houseCalendar.getAttribute("data-house-id");
  const response = await fetch("/get-tasks/" + houseID);
  const movies = await response.json();
  // console.log(movies);
  return movies;
}

function convertTime(time) {
  const date = new Date(time);
  const offset = date.getTimezoneOffset();
  const offsetMilliseconds = offset * 60 * 1000;
  const time2 = new Date(date.getTime() + offsetMilliseconds);
  const adjustedTime = new Date(time2.getTime() - 2 * 60 * 60 * 1000);
  return adjustedTime;
}