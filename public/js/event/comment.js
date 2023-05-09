import authCheck from "./validtionChecker.js";

document.addEventListener("DOMContentLoaded", function () {
    const commentForm = document.getElementById('comment-form');

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const commentText = document.getElementById('comment-text').value;
        const eventId = commentForm.getAttribute('data-event-id');

        try {
            const checkedComment = authCheck.checkComment(commentText);
            const response = await fetch(`/events/${eventId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commentText: checkedComment
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Refresh the page
                window.location.href=`/events/${eventId}`
            } else {
                // Display an error message
                const errorMessage = document.createElement('p');
                errorMessage.innerText = data.message;
                commentForm.appendChild(errorMessage);
            }
        } catch (e) {
            console.log(e);
        }
    })
});