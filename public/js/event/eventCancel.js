document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll(".cancel-btn");
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", async function (event) {
            event.preventDefault(); 
            const eventId = event.target.dataset.event_id;
            const userId = document.querySelector('.container').dataset.userid;

           
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

