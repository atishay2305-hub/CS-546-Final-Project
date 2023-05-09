// import authCheck from "../validtionChecker.js";

// document.addEventListener("DOMContentLoaded", function () {
//     const commentForm = document.getElementById('comment-form');

//     commentForm.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const commentText = document.getElementById('comment-text').value;
//         const eventId = commentForm.getAttribute('data-event-id');

//         try {
//             const checkedComment = authCheck.checkComment(commentText);
//             const response = await fetch(`/events/${eventId}/comment`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     commentText: checkedComment
//                 })
//             });

//             const data = await response.json();

//             if (data.status === 'success') {
//                 // Refresh the page
//                 window.location.href=`/events/${eventId}`
//             } else {
//                 // Display an error message
//                 const errorMessage = document.createElement('p');
//                 errorMessage.innerText = data.message;
//                 commentForm.appendChild(errorMessage);
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     })
// });
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