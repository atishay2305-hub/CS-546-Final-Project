function showCommentsPopup(eventId) {
    const commentsButton = document.getElementById(`comment-btn-${eventId}`);
    const commentsPopup = document.getElementById(`comments-${eventId}`);

    if (commentsPopup.style.display === '' || commentsPopup.style.display === 'none') {
        commentsPopup.style.display = 'block';
        commentsButton.innerText = 'Hide Comments';

        const closeCommentsPopup = function (event) {
            if (!commentsPopup.contains(event.target) && event.target !== commentsButton) {
                commentsPopup.style.display = 'none';
                commentsButton.innerText = 'Show Comments';
                document.removeEventListener('click', closeCommentsPopup);
            }
        };
        document.addEventListener('click', closeCommentsPopup);
    }
    else {
        commentsPopup.style.display = 'none';
        commentsButton.innerText = 'Show Comments';
        const closeCommentsPopup = function (event) {
            if (!commentsPopup.contains(event.target)) {
                commentsPopup.style.display = 'none';
                commentsButton.innerText = 'Show Comments';
                document.removeEventListener('click', closeCommentsPopup);
            }
        };
        document.removeEventListener('click', closeCommentsPopup);
    }
}