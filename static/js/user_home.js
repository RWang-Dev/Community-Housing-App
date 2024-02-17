function toggleNavbarOnScroll() {
    let prevScrollY = window.scrollY;
    let navbar = document.querySelector(".navigation-bar");
    let navbarHeight = navbar.clientHeight;
  
    window.onscroll = function () {
      let currentScrollY = window.scrollY;
      if (prevScrollY > currentScrollY && currentScrollY < navbarHeight) {
        navbar.style.top = "0";
      } else {
        navbar.style.top = "-" + navbarHeight + "px";
      }
      prevScrollY = currentScrollY;
    };
  }
  
window.onload = toggleNavbarOnScroll;

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const houses = document.querySelectorAll(".house");

  searchBar.addEventListener("input", () => {
      const userInput = searchBar.value.trim().toLowerCase();
      houses.forEach(house => {
          const houseName = house.textContent.toLowerCase();
          if (houseName.includes(userInput)) {
              house.style.display = "table-row";
          } 
          else {
              house.style.display = "none"; 
          }
      })
  })
});

function joinHouse(houseId) {
  fetch('/join-house', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ house_id: houseId })
    })
    .then(response => {
        if(response.ok) {
          return response.json();
        } 
        else {
          throw new Error('error');
        }
    })
    .then(data => {
      console.log('House joined successfully');
    })
    .catch(error => {
      console.error('Error joining house:', error);
    });
}