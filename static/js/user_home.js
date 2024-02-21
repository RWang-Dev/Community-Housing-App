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

async function leaveHouse(houseID) {
  const parentDiv = document.getElementById("house-" + String(houseID));
  const isLastMember = await checkIfLastMember(houseID);

  if (isLastMember) {
    const confirmation = confirm(
      "You are the last member of this house. Are you sure you want to leave?"
    );
    if (!confirmation) {
      return;
    }
  }

  parentDiv.remove();
  const params = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ house_id: houseID }),
  };

  const result = await fetch("/leave-house", params);

  location.reload();
}

async function checkIfLastMember(houseID) {
  const response = await fetch(`/check-last-member?house_id=${houseID}`);
  const data = await response.json();
  return data.is_last_member;
}
async function joinHouse(houseID, houseName) {
  const params = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ house_id: houseID }),
  };

  const result = await fetch("/join-house", params);

  var newHouseDiv = document.createElement("div");
  newHouseDiv.classList.add("house");

  var houseNameDiv = document.createElement("div");
  houseNameDiv.textContent = houseName;

  // enter and leave buttons
  var enterButton = document.createElement("button");
  enterButton.textContent = "Enter";
  enterButton.addEventListener("click", function () {
    // have to use backticks if you're using something like ${}
    window.location.href = `/house/${houseID}`;
  });

  var leaveButton = document.createElement("button");
  leaveButton.textContent = "Leave House";
  leaveButton.addEventListener("click", function () {
    newHouseDiv.remove();
  });

  newHouseDiv.appendChild(houseNameDiv);
  newHouseDiv.appendChild(enterButton);
  newHouseDiv.appendChild(leaveButton);

  var myHousesDiv = document.querySelector(".my-houses");
  myHousesDiv.appendChild(newHouseDiv);
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const houses = document.querySelectorAll(".house");

  searchBar.addEventListener("input", () => {
    const userInput = searchBar.value.trim().toLowerCase();
    houses.forEach((house) => {
      const houseName = house.textContent.toLowerCase();
      if (houseName.includes(userInput)) {
        house.style.display = "table-row";
      } else {
        house.style.display = "none";
      }
    });
  });
});
