
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

        
//         const commentForm = document.getElementById(`comment-form-${postId}`);
//         const commentText = document.getElementById(`comment-text-${postId}`);
//         const commentError = document.getElementById(`comment-error-${postId}`);

//         commentForm.addEventListener('submit', (event) => {
//             event.preventDefault();
            
//             const comment = commentText.value.trim();
//             console.log("hereeeeeeeeeeeeeeeeeee------>>>>", comment);

//             if (comment === '') {
//                 commentError.innerText = 'Comment cannot be empty.';
//                 commentError.style.display = 'block';
//                 return;
//             }

//             if (comment.length > 300) {
//                 commentError.innerText = 'Comment should not exceed 300 characters.';
//                 commentError.style.display = 'block';
//                 return;
//             }

//             // Submit the comment form if it passes validation
//             commentError.style.display = 'none';
//             commentForm.submit();
//         });
//     }
// }


  function validateForm(event) {
    event.preventDefault(); // prevent the form from submitting
    const commentInput = document.getElementById(`comment-text-${this._id}`);
    console.log("there", commentInput);
    const commentText = commentInput.value.trim();
    if (!commentText) {
      alert('Please enter a comment');
      return;
    }
    // if the input is valid, submit the form using fetch
    fetch(`/posts/${this._id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: this._id, commentText })
    })
    .then(response => response.json())
    .then(data => {

      console.log(data);
    })
    .catch(error => {

      console.error(error);
    });
  }
    }
}

