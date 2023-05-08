
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


//   function validateForm(event) {
//     event.preventDefault(); // prevent the form from submitting
//     const commentInput = document.getElementById(`comment-text-${this._id}`);
//     console.log("there", commentInput);
//     const commentText = commentInput.value.trim();
//     if (!commentText) {
//       alert('Please enter a comment');
//       return;
//     }
//     // if the input is valid, submit the form using fetch
//     fetch(`/posts/${this._id}/comment`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ postId: this._id, commentText })
//     })
//     .then(response => response.json())
//     .then(data => {
//       // handle the response from the server
//       console.log(data);
//     })
//     .catch(error => {
//       // handle any errors that occur during the request
//       console.error(error);
//     });
//   }
//     }
// }

function addComment(event, id, button) {
    event.preventDefault();

    const discussionElement = button.parentNode;
    //console.log(id);
    const cmtErrEle = document.getElementById(`comment-error-${id}`);

    //const commentInput = discussionElement.getElementById(`comment-text-${this._id}`).value;
    const commentInput = discussionElement.querySelector(`#comment-text-${id}`).value;
    console.log("there ---------------------->", commentInput);
    //
    if (!commentInput || !commentInput.trim()) {
        cmtErrEle.innerHTML = 'Cannot submit an empty comment';
        cmtErrEle.style.display ='block';
        return;
    }
    const commentText = commentInput.trim();
    console.log(commentText);
    if(commentText.length > 300){
        cmtErrEle.innerHTML = 'Comment cannot be more than 300 characters';
        cmtErrEle.style.display ='block';
        return; 
    }
    fetch(`/posts/${id}/comment`, {
        method: "post",
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        },
        body: JSON.stringify({commentText:commentText})
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            //return response.json()
            alert('Bad Input Error');
        }
    })
    // .then((data) => {
    //     if (data) {
    //         if (!data.success) {
    //             document.getElementById(`comment-text-${this._id}`).value = data.eventName;
    //         }
    //     }
    // })
    .catch(error => {
        alert(error.message || "Something went wrong.");
    });

}

