document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll(".cancel-btn");
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", async function (event) {
            event.preventDefault(); // prevent form from submitting
            const eventId = event.target.dataset.event_id;
            const userId = document.querySelector('.container').dataset.userid;

            // Make a fetch request to remove the user from the attendee list
            fetch(`/events/${eventId}/attendees/${userId}`, {
                method: "DELETE"
            }).then((response) => {
                if (!response.ok) {
                    throw response.statusText;
                }
                return response.json();
            }).then((data) => {
                location.href = "/events";
            }).catch((error) => {
                console.error(error);
            });
        });
    });
});

