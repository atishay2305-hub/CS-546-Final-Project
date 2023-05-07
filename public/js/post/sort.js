let sortingCriteria = [];

document.getElementById('sortCriteria').addEventListener('change', function(event) {
    event.preventDefault();
    sortPosts();
});
function sortPosts(criteria) {
    let postsContainer = document.getElementById('posts-container');
    let posts = Array.from(postsContainer.getElementsByClassName('post-container'));

    // Check if the sorting criteria already exists in the array and move it to the front
    let index = sortingCriteria.indexOf(criteria);
    if (index > -1) {
        sortingCriteria.splice(index, 1);
    }
    sortingCriteria.unshift(criteria);

    // Apply all the sorting criteria
    posts.sort((a, b) => {
        for (let i = 0; i < sortingCriteria.length; i++) {
            let currentCriterion = sortingCriteria[i];
            switch (currentCriterion) {
                case 'a-z':
                    let contentA = a.querySelector('h2').innerText.toUpperCase();
                    let contentB = b.querySelector('h2').innerText.toUpperCase();
                    let contentComparison = contentA.localeCompare(contentB);
                    if (contentComparison !== 0) {
                        return contentComparison;
                    }
                    break;
                case 'created_date':
                    let dateAElement = a.querySelector('p.create_date');
                    let dateBElement = b.querySelector('p.create_date');
                    if (!dateAElement || !dateBElement) {
                        // Handle missing date attributes
                        return 0;
                    }
                    let dateA = new Date(dateAElement.getAttribute('data-created_Date'));
                    let dateB = new Date(dateBElement.getAttribute('data-created_Date'));
                    let dateComparison = dateB - dateA;
                    if (dateComparison !== 0) {
                        return dateComparison;
                    }
                    break;

                case 'most_likes':
                    let likesAElement = a.querySelector('span.like-count');
                    let likesBElement = b.querySelector('span.like-count');
                    if (!likesAElement || !likesBElement) {
                        // Handle missing like count elements
                        return 0;
                    }
                    let likesA = parseInt(likesAElement.innerText);
                    let likesB = parseInt(likesBElement.innerText);
                    let likesComparison = likesB - likesA;
                    if (likesComparison !== 0) {
                        return likesComparison;
                    }
                    break;
            }
        }
        // If all sorting criteria are equal, maintain the original order
        return a.getAttribute('data-order') - b.getAttribute('data-order');
    });

    // Append the sorted posts to the container
    postsContainer.innerHTML = '';
    posts.forEach((post) => {
        postsContainer.appendChild(post);
    });
}
