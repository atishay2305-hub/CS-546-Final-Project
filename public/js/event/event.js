import authCheck from "../validtionChecker.js";
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const eventForm = document.getElementById("event-form");
        const errorHandle = document.getElementById("eventError");

        if (eventForm) {
            eventForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;

                let eventName = document.getElementById("eventName").value;
                let description = document.getElementById("description").value;
                let buildingName = document.getElementById("buildingName").value;
                let organizer = document.getElementById("organizer").value;
                let seatCapacity = document.getElementById("seatCapacity").value;


                try {
                    eventName = authCheck.checkName(eventName);
                    description = authCheck.checkPhrases(description, "Description");
                    buildingName = authCheck.checkLocation(buildingName);
                    organizer = authCheck.checkName(organizer);
                    seatCapacity = authCheck.checkCapacity(seatCapacity);
                } catch (e) {
                    document.getElementById("eventName").setAttribute("value", eventName);
                    document.getElementById("description").setAttribute("description", description);
                    document.getElementById("buildingName").setAttribute("buildingName", buildingName);
                    document.getElementById("organizer").setAttribute("organizer", organizer);
                    document.getElementById("seatingCapacity").setAttribute("searCapacity", seatCapacity);
                    return handleError(e || "Something went wrong");
                }
                fetch("/events", {
                    method: "post",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        eventName: eventName,
                        description: description,
                        buildingName: buildingName,
                        organizer: organizer,
                        seatCapacity: seatCapacity
                    }),
                }).then((response) => {
                    if(!response.ok){
                        return response.json();
                    }
                }).then((data) => {
                    if (data) {
                        if (!data.success) {
                            document.getElementById("eventName").value = data.eventName;
                            document.getElementById("description").value = data.description;
                            document.getElementById("buildingName").value = data.buildingName;
                            document.getElementById("organizer").value = data.organizer;
                            document.getElementById("seatingCapacity").value = data.seatingCapacity;
                            return handleError(data || "Something went wrong.");
                        }
                    }
                    location.href = "/homepage";

                }).catch((e) => {
                    alert(e || "Something went wrong.");
                });
            });
        }
        const handleError = (errorMsg) => {
            errorHandle.hidden = false;
            errorHandle.innerHTML = errorMsg;
        };
    });

})();
