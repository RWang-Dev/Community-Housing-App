document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('task-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var house_id = window.location.pathname.split('/').pop();
        var formData = new FormData(document.getElementById('task-form'));
        fetch(`/assign-task/${house_id}`, {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if(response.ok) {
                window.location.href = `/house/${house_id}`;
            } 
            else {
                console.error('Fail:', response.statusText);
            }
        })
    });
});