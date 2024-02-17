document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const houses = document.querySelectorAll(".house");

    searchBar.addEventListener("input", () => {
        const userInput = searchBar.value.trim().toLowerCase();
        houses.forEach(house => {
            const houseName = house.textContent.toLowerCase();
            if (houseName.includes(userInput)) {
                house.style.display = "table-row";
            } else {
                house.style.display = "none"; 
            }
        });
    });

    document.querySelectorAll(".members-btn").forEach(button => {
        button.addEventListener("click", () => {
            const houseId = button.dataset.houseId;
            fetch(`/get-members?house_id=${houseId}`)
                .then(response => response.json())
                .then(data => {
                    const members = data.members;
                    if (members.length === 0) {
                        alert("No members");
                    } 
                    else {
                        alert(`Members: ${members.join(", ")}`);
                    }
                })
        });
    });
});
