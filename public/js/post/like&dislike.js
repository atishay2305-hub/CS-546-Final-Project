function toggleLike(postId, button) {
    const isLiked = button.classList.contains('liked');
    const isDisliked = button.classList.contains('disliked');
    const storageKey = `post-${postId}-state`;
    const localStorageValue = localStorage.getItem(storageKey);

    let liked, disliked;
    if (typeof localStorage !== 'undefined') {
        if (localStorageValue === null) {
            liked = !isLiked;
            disliked = isDisliked;
        } else {
            const parsedValue = JSON.parse(localStorageValue);
            liked = parsedValue.liked;
            disliked = parsedValue.disliked;
        }
    } else {
        // Handle the absence of localStorage
        liked = !isLiked;
        disliked = isDisliked;
    }

    fetch(`/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked, disliked }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to update like');
            }
            return response.json();
        })
        .then((result) => {
            const likeCountElement = button.querySelector('.like-count');
            const dislikeCountElement = button.querySelector('.dislike-count');
            const currentLikes = parseInt(likeCountElement.textContent);
            const currentDislikes = parseInt(dislikeCountElement.textContent);

            likeCountElement.textContent = liked ? currentLikes + 1 : currentLikes - 1;
            dislikeCountElement.textContent = disliked ? Math.max(currentDislikes - 1, 0) : currentDislikes;

            button.classList.toggle('liked', liked);
            button.classList.remove('disliked');

            const newLocalStorageValue = JSON.stringify({ liked, disliked: false });
            localStorage.setItem(storageKey, newLocalStorageValue);
        })
        .catch((e) => {
            console.error(e);
        });
}

function toggleDislike(postId, button) {
    const isLiked = button.classList.contains('liked');
    const isDisliked = button.classList.contains('disliked');
    const storageKey = `post-${postId}-state`;
    const localStorageValue = localStorage.getItem(storageKey);

    let liked, disliked;
    if (typeof localStorage !== 'undefined') {
        if (localStorageValue === null) {
            liked = isLiked;
            disliked = !isDisliked;
        } else {
            const parsedValue = JSON.parse(localStorageValue);
            liked = parsedValue.liked;
            disliked = parsedValue.disliked;
        }
    } else {
        liked = isLiked;
        disliked = !isDisliked;
    }

    if (disliked) {
        return; // If already disliked, do nothing
    }

    fetch(`/posts/${postId}/dislike`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked, disliked: true }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to update dislike');
            }
            return response.json();
        })
        .then((result) => {
            const likeCountElement = button.querySelector('.like-count');
            const dislikeCountElement = button.querySelector('.dislike-count');
            const currentLikes = parseInt(likeCountElement.textContent);
            const currentDislikes = parseInt(dislikeCountElement.textContent);

            dislikeCountElement.textContent = currentDislikes + 1;
            likeCountElement.textContent = disliked ? Math.max(currentLikes - 1, 0) : currentLikes;

            // button.classList.toggle('dis
           button.classList.add('disliked');
            button.classList.remove('liked');

            const newLocalStorageValue = JSON.stringify({ liked, disliked: true });
            localStorage.setItem(storageKey, newLocalStorageValue);
        })
        .catch((e) => {
            console.error(e);
        });
}