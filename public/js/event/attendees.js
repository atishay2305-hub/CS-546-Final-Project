function showAttendeesPopup(eventId) {
    const attendeesButton = document.querySelector(`[data-event_id="${eventId}"]`);
    const attendeesPopup = document.getElementById(`attendees-container-${eventId}`);
    const attendeelistbutton= document.getElementById(`attendee-list`);
    if (attendeesPopup.style.display === 'block') {
        attendeesPopup.style.display = 'none';
        attendeelistbutton.innerHTML = '<ion-icon name="people-outline"></ion-icon> Attendee List';
    } else {
        attendeesPopup.style.display = 'block';
        attendeelistbutton.innerHTML = '<ion-icon name="people-outline"></ion-icon> Hide Attendee List';
        attendeelistbutton.addEventListener('click', closeAttendeesPopup);
    }
    function closeAttendeesPopup() {
        attendeesPopup.style.display = 'none';
        attendeelistbutton.innerHTML = '<ion-icon name="people-outline"></ion-icon> Attendee List';
        attendeelistbutton.removeEventListener('click', closeAttendeesPopup);
    }
}