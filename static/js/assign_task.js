function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const phrases = [
  "cooking?",
  "cleaning?",
  "going shopping?",
  "taking out the trash?",
  "cleaning out the fridge?",
  "dusting the blinds?",
];
const element = document.getElementById("typewriter");
let sleep_time = 100; // This can be adjusted or used for typing effect
let current_phrase = 0;

// Example color cycle - selected for contrast against the background
// Adjust colors as needed to match or complement your background animation phases
const colors = ["#1105b9", "#8000ff", "#0044ff", "#fefefe"];
let colorIndex = 0;

const changeTypewriterColor = async () => {
  while (true) {
    // Change the typewriter text color
    element.style.color = colors[colorIndex];

    // The total animation time is divided by the number of colors to change at even intervals
    await sleep(10000 / colors.length); // Adjust based on your background animation duration

    // Move to the next color
    colorIndex = (colorIndex + 1) % colors.length;
  }
};

const writeloop = async () => {
  while (true) {
    let CurrWord = phrases[current_phrase];
    for (let i = 0; i < CurrWord.length; i++) {
      element.innerText = CurrWord.substring(0, i + 1);
      await sleep(sleep_time);
    }

    await sleep(sleep_time * 10); // Wait for 1 second before showing the next phrase

    for (let i = CurrWord.length; i > 0; i--) {
      element.innerText = CurrWord.substring(0, i - 1);
      await sleep(sleep_time);
    }
    await sleep(sleep_time * 5);

    current_phrase = (current_phrase + 1) % phrases.length; // Move to the next phrase, loop back to first after the last
  }
};

// Initialize the functions
document.addEventListener("DOMContentLoaded", function () {
  writeloop();
  changeTypewriterColor();
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("task-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var house_id = window.location.pathname.split("/").pop();
      var formData = new FormData(document.getElementById("task-form"));
      fetch(`/assign-task/${house_id}`, {
        method: "POST",
        body: formData,
      }).then(function (response) {
        if (response.ok) {
          window.location.href = `/house/${house_id}`;
        } else {
          console.error("Fail:", response.statusText);
        }
      });
    });
});
