function toggleLike(postId, button) {
    const isLiked = button.classList.contains('liked');
    const isDisliked = button.classList.contains('disliked');
    const storageKey = `post-${postId}-state`;
    const localStorageValue = localStorage.getItem(storageKey);

    let liked, disliked;
    if (typeof localStorage !== 'undefined') {
        const localStorageValue = localStorage.getItem(storageKey);
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
        body: JSON.stringify({ liked: true, disliked }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json();
            }
            return response.json();
        })
        .then((result) => {
            const likeCountElement = button.querySelector('.like-count');
            const dislikeCountElement = button.querySelector('.dislike-count');
            const currentLikes = parseInt(likeCountElement.textContent);
            const currentDislikes = parseInt(dislikeCountElement.textContent);

            likeCountElement.textContent = currentLikes + 1;
            dislikeCountElement.textContent = Math.max(currentDislikes - 1, 0);

            button.classList.add('liked');
            button.classList.remove('disliked');

            const newLocalStorageValue = JSON.stringify({ liked: true, disliked });
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
        const localStorageValue = localStorage.getItem(storageKey);
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
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked, disliked: true }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json();
            }
            return response.json();
        })
        .then((result) => {
            const likeCountElement = button.querySelector('.like-count');
            const dislikeCountElement = button.querySelector('.dislike-count');
            const currentLikes = parseInt(likeCountElement.textContent);
            const currentDislikes = parseInt(dislikeCountElement.textContent);

            dislikeCountElement.textContent = currentDislikes + 1;
            likeCountElement.textContent = Math.max(currentLikes - 1, 0);

            button.classList.add('disliked');
            button.classList.remove('liked');

            const newLocalStorageValue = JSON.stringify({ liked, disliked: true });
            localStorage.setItem(storageKey, newLocalStorageValue);
        })
        .catch((e) => {
            console.error(e);
        });
}