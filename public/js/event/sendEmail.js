document.addEventListener("DOMContentLoaded", function () {
    const registerButtons = document.querySelectorAll(".register-btn");
    registerButtons.forEach(registerButton => {
        registerButton.addEventListener("click", async function (event) {
            event.preventDefault(); 
            const eventId = event.target.dataset.event_id;
            const userId = document.querySelector('.container').dataset.userid;
            const email = document.querySelector('.container').dataset.email;

            const confirmationEmail = {
                userId: userId,
                email: email,
                eventId: eventId
            };

            fetch("events/event-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(confirmationEmail)
            }).then((response) => {
                if (!response.ok) {
                    throw  Error(response.statusText);
                }
                return response.json();
            }).then((data) => {
                alert(data.message);
                location.href = "/events";
            })
        });
    });
});