import authCheck from "../validtionChecker.js";

document.addEventListener("DOMContentLoaded", function () {
    const eventForm = document.getElementById("event-form");
    const errorHandle = document.getElementById("eventError");
    const eventImageInput = document.getElementById("eventImage");
    const imagePreview = document.getElementById("image-preview");

    if (eventForm) {
        eventForm.addEventListener("submit", (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            errorHandle.hidden = true;

            let eventName = document.getElementById("eventName").value;
            let description = document.getElementById("description").value;
            let date = document.getElementById("date").value;
            let buildingName = document.getElementById("buildingName").value;
            let roomNumber = document.getElementById("roomNumber").value;
            let organizer = document.getElementById("organizer").value;
            let seatingCapacity = document.getElementById("seatingCapacity").value;
            let file = eventImageInput.files[0]; // FIX: should be files not file

            try {
                eventName = authCheck.checkName(eventName);
                description = authCheck.checkPhrases(description, "Description");
                date = authCheck.checkDate(date);
                buildingName = authCheck.checkLocation(buildingName);
                roomNumber = authCheck.checkRoom(roomNumber);
                organizer = authCheck.checkName(organizer);
                seatingCapacity = authCheck.checkCapacity(seatingCapacity);
            } catch (e) {
                document.getElementById("eventName").setAttribute("value", eventName);
                document.getElementById("description").setAttribute("value", description);
                document.getElementById("date").setAttribute("value", date);
                document.getElementById("buildingName").setAttribute("value", buildingName);
                document.getElementById("roomNumber").setAttribute("value", roomNumber);
                document.getElementById("organizer").setAttribute("value", organizer);
                document.getElementById("seatingCapacity").setAttribute("value", seatingCapacity); // FIX: attribute name was wrong
                return handleError(e || "Something went wrong");
            }

            const formData = new FormData();
            formData.append("eventName", eventName);
            formData.append("description", description);
            formData.append("date", date);
            formData.append("buildingName", buildingName);
            formData.append("roomNumber", roomNumber);
            formData.append("organizer", organizer);
            formData.append("seatingCapacity", seatingCapacity);
            formData.append("eventImage", file);

            fetch("/events", {
                method: "post",
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json();
                    }
                })
                .then((data) => {
                    if (data) {
                        if (!data.success) {
                            document.getElementById("eventName").value = data.eventName;
                            document.getElementById("description").value = data.description;
                            document.getElementById("date").value = data.date;
                            document.getElementById("buildingName").value = data.buildingName;
                            document.getElementById("roomNumber").value = data.roomNumber;
                            document.getElementById("organizer").value = data.organizer;
                            document.getElementById("seatingCapacity").value = data.seatingCapacity; // FIX: element id was wrong
                            return handleError(data.message || "Something went wrong.");
                        }
                    }
                    location.href = "/events";
                })
                .catch((e) => {
                    alert(e || "Something went wrong.");
                });
        });
    }
    if(eventImageInput) {
        eventImageInput.addEventListener("change", function () {
            const file = this.files[0];
            const reader = new FileReader();

            reader.addEventListener("load", function () {
                imagePreview.src = reader.result;
                imagePreview.style.display = "block";
            });

            reader.readAsDataURL(file);
        });
    }

    const handleError = (errorMsg) => {
        errorHandle.hidden = false;
        errorHandle.innerHTML = errorMsg;
    };
});