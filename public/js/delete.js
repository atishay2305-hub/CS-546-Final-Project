 function deletePost(id) {
    fetch(`/posts/${id}`, {
        method: "delete",
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Post deleted successfully');
                window.location.href = '/posts';
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(() => {
            console.log('This will run after either success or failure');
        })
        .catch(error => {
            alert(error.message || "Something went wrong.");
        });

}

function deleteEvent(id) {
    fetch(`/events/${id}`, {
        method: "delete",
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Event deleted successfully');
                window.location.href = '/events';
            } else {
                throw new Error('Network response was not ok');
            }
        }).then(() => {
        console.log('This will run after either success or failure');
    })
        .catch(error => {
            alert(error.message || "Something went wrong.");
        });

}

function deleteAttendee(id, eventId) {
    fetch(`/events/${eventId}/attendees/${id}`, {
        method: "delete",
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Attendee deleted successfully');
                location.reload();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(() => {
            console.log('This will run after either success or failure');
        })
        .catch(error => {
            alert(error.message || "Something went wrong.");
        });

}

function deleteComment(id, eventId) {
    fetch(`/events/${eventId}/comments/${id}`, {
        method: "delete",
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            alert(error.message || "Something went wrong.");
        });
}