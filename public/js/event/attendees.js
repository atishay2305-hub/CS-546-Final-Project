function showAttendeesPopup(eventId) {
    const attendeesButton = document.querySelector(`[data-event_id="${eventId}"]`);
    const attendeesPopup = document.getElementById(`attendees-container-${eventId}`);

    if (attendeesPopup.style.display === 'block') {
        attendeesPopup.style.display = 'none';
        attendeesButton.innerHTML = '<ion-icon name="people-outline"></ion-icon> Attendee List';
    } else {
        attendeesPopup.style.display = 'block';
        attendeesButton.innerHTML = '<ion-icon name="people-outline"></ion-icon> Hide Attendee List';
        attendeesButton.addEventListener('click', closeAttendeesPopup);
    }

    function closeAttendeesPopup() {
        attendeesPopup.style.display = 'none';
        attendeesButton.innerHTML = '<ion-icon name="people-outline"></ion-icon> Attendee List';
        attendeesButton.removeEventListener('click', closeAttendeesPopup);
    }
}