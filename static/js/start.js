function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  const phrases = [
    "Are You Living with Roommates?",
    "Ready for a self-organizing home?",
    "Tired of meal prep roulette?",
    "Last-minute chores chaos?",
    "Ready for effortless home management?",
    "Want a smart way to share tasks?",
  ];
  const element = document.getElementById("typewriter");
  let sleep_time = 90; // This can be adjusted or used for typing effect
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
  
  // Initialize the functions
  document.addEventListener("DOMContentLoaded", function () {
    writeloop();
  });
  
  