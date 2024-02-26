document.addEventListener("DOMContentLoaded", async function () {
  const restrictions = document.getElementById("restrictions");
  if (restrictions) {
    const house_ID = restrictions.getAttribute("data-house-id");
    document
      .getElementById("ai-form")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        await fetch("/restrictions/" + house_ID, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dietary_restrictions: document.getElementById(
              "dietary-restrictions"
            ).value,
            schedule_restrictions: document.getElementById(
              "schedule-restrictions"
            ).value,
          }),
        });
        window.location.href = "/house/" + house_ID;
      });
  } else {
    console.error("Element with ID 'restrictions' not found.");
  }
});
