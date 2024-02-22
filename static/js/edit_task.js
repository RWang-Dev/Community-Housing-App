document.addEventListener('DOMContentLoaded', async function() {
    const taskList = document.getElementById('task-list');
    const taskNameInput = document.getElementById('task-name');
    const house_id = window.location.pathname.split('/').pop();

    taskList.addEventListener('change', function() {
        const selectedOption = taskList.options[taskList.selectedIndex];
        const taskName = selectedOption.textContent.split('due')[0];
        taskNameInput.value = taskName;
    });

    document.getElementById('task-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        var formData = new FormData(document.getElementById('task-form'));
        console.log(formData);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        const response = await fetch(`/edit-task/${house_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            window.location.href = `/house/${house_id}`;
        } else {
            console.error('Fail:', response.statusText);
        }
    });
});
