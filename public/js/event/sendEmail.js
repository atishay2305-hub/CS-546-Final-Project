const registerButtons = document.querySelectorAll(".register-btn");
let isRegistering = false; 

registerButtons.forEach(function (registerButton) {
    registerButton.addEventListener("click", async function (event) {
        event.preventDefault(); 

        if (isRegistering) {
            return; 
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
            isRegistering = false; 

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