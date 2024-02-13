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
