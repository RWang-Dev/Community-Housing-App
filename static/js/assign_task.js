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
  
  writeloop();

document
  .getElementById("task-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("/submit-your-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_name: document.getElementById("task-name").value,
        person_responsible: document.getElementById("person").value,
        task_due_date: document.getElementById("task-due-date").value,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  });
