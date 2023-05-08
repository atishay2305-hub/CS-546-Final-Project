document.getElementById('posts-container').addEventListener('click', function(event){
    const clickedElement = event.target;
    const postLink = clickedElement.getAttribute('data-href');
    if (postLink) {
        event.preventDefault();
        window.location.href = postLink;
    }
});