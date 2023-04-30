import authCheck from "../validtionChecker.js";
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const eventForm = document.getElementById("event-form");
        const errorHandle = document.getElementById("eventError");
        let eventNameIn = document.getElementById("eventName");
        let descriptionIn = document.getElementById("description");
        let buildingNameIn = document.getElementById("buildingName");
        let organizerIn = document.getElementById("organizer");
        let seatCapacityIn = document.getElementById("seatCapacity");

        if (eventForm) {
            eventForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;

                let eventName = eventNameIn.value;
                let description = descriptionIn.value;
                let buildingName = buildingNameIn.value;
                let organizer = organizerIn.value;
                let seatCapacity = seatCapacityIn.value;


                try {
                    eventName = authCheck.checkName(eventName);
                    description = authCheck.checkPhrases(description, "Description");
                    buildingName = authCheck.checkLocation(buildingName);
                    organizer = authCheck.checkName(organizer);
                    seatCapacity = authCheck.checkCapacity(seatCapacity);
                } catch (e) {
                    document.getElementById("eventName").setAttribute("value", eventName);
                    document.getElementById("postContent").setAttribute("description", description);
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
                        if (data.success) {
                            location.href = "/evnet";
                            sessionStorage.setItem("user", JSON.stringify(data.data));
                        }else{
                            document.getElementById("eventName").value = data.eventName;
                            document.getElementById("description").value = data.description;
                            document.getElementById("buildingName").value = data.buildingName;
                            document.getElementById("organizer").value = data.organizer;
                            document.getElementById("seatCapacity").value = data.seatCapacity;
                            return handleError(data || "Something went wrong");
                        }
                    }
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
