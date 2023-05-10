
function addComment(event, id, button) {
    event.preventDefault();
    const discussionElement = button.parentNode;
 
    const cmtErrEle = document.getElementById(`comment-error-${id}`);
   
    const commentInput = discussionElement.querySelector(`#comment-text-${id}`).value;
   
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
          
            alert('Bad Input Error');
        }
    })
  
    .catch(error => {
        alert(error.message || "Something went wrong.");
    });
}