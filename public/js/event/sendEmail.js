const registerButtons = document.querySelectorAll(".register-btn");
let isRegistering = false; // Flag to indicate if registration process is in progress

registerButtons.forEach(function (registerButton) {
    registerButton.addEventListener("click", async function (event) {
        event.preventDefault(); // prevent form from submitting

        if (isRegistering) {
            return; // Ignore button click if already registering
        }
        isRegistering = true;

        const eventId = registerButton.dataset.event_id;
        const userId = document.querySelector('.container').dataset.userid;
        const email = document.querySelector('.container').dataset.email;

        const confirmationEmail = {
            userId: userId,
            email: email,
            eventId: eventId
        };

        fetch("/events/event-register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(confirmationEmail)
        }).then((response) => {
            isRegistering = false; // Reset flag when registration process is complete

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data) => {
            alert(data.message);
        }).catch((error) => {
            alert(error.message);
        })
    });
});