function showCommentsPopup(eventId) {
    const commentsButton = document.getElementById(`comment-btn-${eventId}`);
    const commentsPopup = document.getElementById(`comments-${eventId}`);

   
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
    fetch(`/events/${id}/comment`, {
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