const categories = [
    "events", "education", "sports", "food", "random", "books", "anime", "games", "TV", "Programming"
];

const categoryElement = document.getElementsByClassName("category");
const searchElement = document.getElementById('search');

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let categoryParam;
if (params.category && categories.includes(params.category)) {
    categoryParam = params.category;
}

if (params.search) {
    searchElement.value = params.search;
}

for (let i = 0; i < categoryElement.length; i++) {
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.text = category;
        option.value = category;
        if (category === categoryParam) {
            option.selected = true;
        }
        categoryElement[i].appendChild(option);
    });
}

categories.forEach((category) => {
    const option = document.createElement("option");
    option.text = category;
    option.value = category;
});

function replyForm(postId, button) {
    const replies = button.nextElementSibling;

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
        const replyText = discussionElement.querySelector('textarea').value;
        const errorElement = discussionElement.querySelector('.error-message');
    
        // Check if reply text is empty
        if (replyText.trim() === '') {
            errorElement.innerHTML = 'Please enter a reply.';
            return;
        }

        if (replyText.length > 300) {
            errorElement.innerHTML = 'Reply exceeds the maximum character limit of 300.';
            return;
          }
    
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
                    location.reload();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                errorElement.innerHTML = error.message || "Something went wrong.";
            });
    }
     