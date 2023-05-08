
function toggleComments( button) {
    const replies = button.nextElementSibling;

    // Toggle the display of the replies
    if (replies.style.display === 'block') {
        replies.style.display = 'none';
        button.innerText = 'View Comments';
    } else {
        replies.style.display = 'block';
        button.innerText = 'Hide Comments';
    }
}


function showReplyForm(button) {

const discussionElement = button.parentNode;

const replyForm = discussionElement.querySelector('.reply-form');

replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
}


function postReply(event, postId, button) {
    event.preventDefault();

    const discussionElement = button.parentNode;
    const cmtErrEle = document.getElementById('cmt-err')
    const replyText = discussionElement.querySelector('#Sreply-textarea').value;
    if(!replyText || !replyText.trim()){
        cmtErrEle.style.display ='block';
        return;
    }
    fetch(`/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commentText: replyText
        })
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            throw new Error('Cannot submit empty comment');
        }
    })
    .catch(error => {
        alert(error.message || "Something went wrong.");
    });
}

function deletePost(id) {
    fetch(`/posts/${id}`, {
        method: "delete",
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            alert('Post deleted successfully');
            location.reload();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        alert(error.message || "Something went wrong.");
    })
    .then(() => {
        console.log('This will run after either success or failure');
    });
}

async function likeFunc (postId,type){

    const response = await fetch(`/posts/${postId}/like`, { method: 'POST' });

      if (response.ok) {
        type ==='home'?window.location.href='/homepage':window.location.href='/posts'

      }
      else{
        alert('error');
      }

}
async function dislikeFunc (postId,type){

    const response = await fetch(`/posts/${postId}/dislike`, { method: 'POST' });
      if (response.ok) {
        //location.reload();
        type ==='home'?window.location.href='/homepage':window.location.href='/posts'
      }
      else{
        alert('error');
      }

}
