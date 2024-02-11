document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('/submit-your-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task_name: document.getElementById('task-name').value,
            person_responsible: document.getElementById('person').value,
            task_due_date: document.getElementById('task-due-date').value,
        }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});