const categories = [
    "events", "education", "sports", "food", "random", "books", "anime", "games", "TV", "Programming"];

const selectElement = document.getElementById("category");

categories.forEach((category) => {
    const option = document.createElement("option");
    option.text = category;
    option.value = category;
    selectElement.appendChild(option);
});


function replyForm(postId, button) {
    const replies = button.nextElementSibling;

    // Toggle the display of the replies
    if (replies.style.display === 'block') {
        replies.style.display = 'none';
        button.innerText = 'Show replies';
    } else {
        replies.style.display = 'block';
        button.innerText = 'Hide replies';
    }
}


function showReplyForm(button) {

const discussionElement = button.parentNode;

const replyForm = discussionElement.querySelector('.reply-form');

replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
}

function postReply(event, discussionId, button) {
event.preventDefault();

const discussionElement = button.parentNode;

const replyText = discussionElement.querySelector('#reply-textarea').value;

fetch(`/discussions/${discussionId}/replies`, {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    message: replyText
})
})
.then(response => {
      if (response.ok) {
          alert('reply added successfully');
          window.location.href = `/discuss`;
      } else {
          throw new Error('Network response was not ok');
      }
})
.catch(error => {
alert(error.message || "Something went wrong.");
});
}