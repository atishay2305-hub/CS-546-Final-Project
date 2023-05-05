function showCommentsPopup(postId) {
    const commentsButton = document.getElementById(`comment-btn-${postId}`);
    const commentsPopup = document.getElementById(`comments-${postId}`);

    // Toggle the display of the comments popup
    if (commentsPopup.style.display === 'block') {
        commentsPopup.style.display = 'none';
        commentsButton.innerText = 'Show Comments';
    } else {
        commentsPopup.style.display = 'block';
        commentsButton.innerText = 'Hide Comments';

        // Add event listener to close the comments popup when clicking outside of it
        const closeCommentsPopup = function (event) {
            if (!commentsPopup.contains(event.target)) {
                commentsPopup.style.display = 'none';
                commentsButton.innerText = 'Show Comments';
                document.removeEventListener('click', closeCommentsPopup);
            }
        };

        // Add event listener to prevent closing the popup when clicking inside it
        const preventPopupClose = function (event) {
            event.stopPropagation();
        };

        // Attach event listeners
        document.addEventListener('click', closeCommentsPopup);
        commentsPopup.addEventListener('click', preventPopupClose);
    }
}