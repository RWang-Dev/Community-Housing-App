document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var houseId = calendarEl.dataset.houseId;
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', 
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay' // Buttons for monthly, weekly, and daily views
    },
    events: `/get-tasks/${houseId}`
  });
  calendar.render();
});