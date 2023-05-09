function showCommentsPopup(postId) {
    const commentsButton = document.getElementById(`comment-btn-${postId}`);
    const commentsPopup = document.getElementById(`comments-${postId}`);
    if (commentsPopup.style.display === 'block') {
        commentsPopup.style.display = 'none';
        commentsButton.innerText = 'Show Comments';
    } else {
        commentsPopup.style.display = 'block';
        commentsButton.innerText = 'Hide Comments';

        const closeCommentsPopup = function (event) {
            if (!commentsPopup.contains(event.target)) {
                commentsPopup.style.display = 'none';
                commentsButton.innerText = 'Show Comments';
                document.removeEventListener('click', closeCommentsPopup);
            }
        };

        const preventPopupClose = function (event) {
            event.stopPropagation();
        };
        document.addEventListener('click', closeCommentsPopup);
        commentsPopup.addEventListener('click', preventPopupClose);
    }
}