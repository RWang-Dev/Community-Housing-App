const house_id = document.getElementById('house-id')
const id = house_id.getAttribute('data-house-id')
document.getElementById('ai-form').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('/restrictions/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dietary_restrictions: document.getElementById('dietary-restrictions').value,
            schedule_restrictions: document.getElementById('schedule-restrictions').value,
        }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});