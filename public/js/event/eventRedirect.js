document.getElementById('events-container').addEventListener('click', function(event){
    const clickedElement = event.target;
    const eventLink = clickedElement.getAttribute('data-href');
    if (eventLink) {
        event.preventDefault();
        window.location.href = eventLink;
    }
});