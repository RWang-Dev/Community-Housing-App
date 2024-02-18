
document.addEventListener("DOMContentLoaded", async function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay", // Buttons for monthly, weekly, and daily views
    },
  });

  const tasks = await logMovies();
  var due_days = [];
  for (var i = 0; i < tasks.length; i++) {
    due_days.push(tasks[i]["end-day"]);
  }
  console.log(due_days);

  const dayCounts = {};

  for (let i = 0; i < due_days.length; i++) {
    const parsedDate = new Date(due_days[i]);

    const formattedDate = parsedDate.toISOString().split("T")[0];

    if (dayCounts.hasOwnProperty(formattedDate)) {
      dayCounts[formattedDate] += 1;
    } else {
      dayCounts[formattedDate] = 1;
    }
  }

  for (const day in dayCounts) {
    var t = " Task";
    if (dayCounts[day] > 1) {
      t = " Tasks";
    }
    calendar.addEvent({
      title: dayCounts[day] + t,
      start: day,
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
