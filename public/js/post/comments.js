
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

                // Validate and handle comment form submission
                const commentForm = document.getElementById(`comment-form-${postId}`);
                const commentText = document.getElementById(`comment-text-${postId}`);
                const commentError = document.getElementById(`comment-error-${postId}`);

                commentForm.addEventListener('submit', (event) => {
                        event.preventDefault();

                        const comment = commentText.value.trim();

                        if (comment === '') {
                                commentError.innerText = 'Comment cannot be empty.';
                                commentError.style.display = 'block';
                                return;
                        }

                        if (comment.length > 300) {
                                commentError.innerText = 'Comment should not exceed 300 characters.';
                                commentError.style.display = 'block';
                                return;
                        }

                        // Submit the comment form if it passes validation
                        commentError.style.display = 'none';
                        commentForm.submit();
                });
        }
}