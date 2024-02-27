document.addEventListener('DOMContentLoaded', async function() {
    const house_id = window.location.pathname.split('/').pop();
    const taskList = document.getElementById('task-list');

    document.getElementById('task-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        if (taskList.options.length === 0) {
            alert('There are no tasks to delete.');
            return;
        }

        const confirmed = confirm("Are you sure you want to delete this task?");

        if (confirmed) {
            var formData = new FormData(document.getElementById('task-form'));
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
            const response = await fetch(`/delete-task/${house_id}`, {
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
        }
    });
});
