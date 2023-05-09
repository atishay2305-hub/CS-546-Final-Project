import authCheck from "./validtionChecker.js";

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const eventRegisterForm = document.getElementById("event-register-form");
        const errorHandle = document.getElementById("eventResisterError");
        if(eventRegisterForm){
            eventRegisterForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                errorHandle.hidden = true;
                let email = document.getElementById("email").value;

                try{
                    email = authCheck.checkEmail(email);
                }catch (e){
                    document.getElementById("email").setAttribute("value", email);
                    return handleError1(e || "Something went wrong");
                }
                const id = eventRegisterForm.dataset.eventId;
                fetch("/events/registration/confirm/:id", {
                    method: "post",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        eventId: id,
                        email: email
                    }),
                }).then((res) => {
                    if(!res.ok){
                        return res.json();
                    }
                }).then((data) => {
                    if (data) {
                        if (!data.success) {
                            // document.getElementById("email").value = data.email;
                            document.getElementById("email").value = data.email;
                            return handleError1(data.message || "Something went wrong.");
                        }
                    }
                    window.location.href = ("/events");
                }).catch((e) => {
                    alert(e || "Something went wrong.");
                });

            })
        }
        const handleError1 = (errorMsg) => {
            errorHandle.hidden = false;
            errorHandle.innerHTML = errorMsg;
        };
    });

})();