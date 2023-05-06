// import authCheck from "../validtionChecker.js";

// (function () {
//     document.addEventListener("DOMContentLoaded", function () {
//         const postForm = document.getElementById("post-form");
//         const errorHandle = document.getElementById("postError");
//         const postImageInput = document.getElementById("postImage");
//         const imagePreview = document.getElementById("image-preview");
//         const categorySelect = document.getElementById("postCategory");
//         const addressInput = document.getElementById("address-input");
//         if (postForm) {
//             postForm.addEventListener("submit", (event) => {
//                 event.stopPropagation();
//                 event.stopImmediatePropagation();
//                 event.preventDefault();
//                 errorHandle.hidden = true;
//                 let address = '';

//                 let category = categorySelect.value;
//                 let postContent = document.getElementById("postContent").value;
//                 let file = postImageInput.files[0];


//                 try {
//                     category = authCheck.checkCategory(category);
//                     postContent = authCheck.checkPhrases(postContent, "Post Content");
//                     if (category === "lost&found") {
//                         address = document.getElementById("address").value;
//                         address = authCheck.checkAddress(address);
//                     }
//                 } catch (e) {
//                     document.getElementById("postCategory").value = category;
//                     document.getElementById("postContent").value = postContent;
//                     return handleError(e || "Something went wrong");
//                 }

//                 const formData = new FormData();
//                 formData.append("category", category);
//                 formData.append("postContent", postContent);
//                 formData.append("postImage", file); // Append the file
//                 formData.append("address", address);

//                 fetch("/posts", {
//                     method: "post",
//                     body: formData,
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             return response.json();
//                         }
//                     })
//                     .then((data) => {
//                         if (data) {
//                             if (!data.success) {
//                                 document.getElementById("postCategory").value = data.category;
//                                 document.getElementById("postContent").value = data.postContent;
//                                 document.getElementById("address").value = data.address;
//                                 return handleError(data.message || "Something went wrong.");
//                             }
//                         }

//                         location.href = "/posts";
//                     })
//                     .catch((e) => {
//                         alert(e || "Something went wrong.");
//                     });

//             });
//         }

//         postImageInput.addEventListener("change", function () {
//             const file = this.files[0];
//             const reader = new FileReader();

//             reader.addEventListener("load", function () {
//                 imagePreview.src = reader.result;
//                 imagePreview.style.display = "block";
//             });

//             reader.readAsDataURL(file);
//         });

//         categorySelect.addEventListener("change", () => {
//             const selectedValue = categorySelect.value;
//             if (selectedValue === "lost&found") {
//                 addressInput.style.display = "block";
//             } else {
//                 addressInput.style.display = "none";
//             }
//         });

//         const handleError = (errorMsg) => {
//             errorHandle.hidden = false;
//             errorHandle.innerHTML = errorMsg;
//         };
//     });
//     // Add event listener to the post form
// const postForm = document.getElementById('post-form');
// postForm.addEventListener('submit', (event) => {
//     event.preventDefault();

//     // Clear previous error messages
//     const postError = document.getElementById('postError');
//     postError.innerHTML = '';
//     postError.hidden = true;

//     // Get form inputs
//     const postCategory = document.getElementById('postCategory').value;
//     const postContent = document.getElementById('postContent').value.trim();
//     const postImage = document.getElementById('postImage').value.trim();

//     // Validate inputs
//     let isValid = true;

//     if (postCategory === '') {
//         isValid = false;
//         addErrorMessage('Post Category is required.');
//     }

//     if (postContent === '') {
//         isValid = false;
//         addErrorMessage('Post Content is required.');
//     } else if (postContent.length > 300) {
//         isValid = false;
//         addErrorMessage('Post Content should not go above 300');
//     }

// })();
import authCheck from "../validtionChecker.js";

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const postForm = document.getElementById("post-form");
        const errorHandle = document.getElementById("postError");
        const postImageInput = document.getElementById("postImage");
        const imagePreview = document.getElementById("image-preview");
        const categorySelect = document.getElementById("postCategory");
        const addressInput = document.getElementById("address-input");

        if (postForm) {
            postForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                errorHandle.hidden = true;
                let address = '';

                let category = categorySelect.value;
                let postContent = document.getElementById("postContent").value;
                let file = postImageInput.files[0];

                try {
                    category = authCheck.checkCategory(category);
                    postContent = authCheck.checkPhrases(postContent, "Post Content");
                    if (category === "lost&found") {
                        address = document.getElementById("address").value;
                        address = authCheck.checkAddress(address);
                    }
                } catch (e) {
                    document.getElementById("postCategory").value = category;
                    document.getElementById("postContent").value = postContent;
                    return handleError(e || "Something went wrong");
                }

                const formData = new FormData();
                formData.append("category", category);
                formData.append("postContent", postContent);
                formData.append("postImage", file); // Append the file
                formData.append("address", address);

                fetch("/posts", {
                    method: "post",
                    body: formData,
                })
                    .then((response) => {
                        if (!response.ok) {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        if (data) {
                            if (!data.success) {
                                document.getElementById("postCategory").value = data.category;
                                document.getElementById("postContent").value = data.postContent;
                                document.getElementById("address").value = data.address;
                                return handleError(data.message || "Something went wrong.");
                            }
                        }

                        location.href = "/posts";
                    })
                    .catch((e) => {
                        alert(e || "Something went wrong.");
                    });

            });
        }

        postImageInput.addEventListener("change", function () {
            const file = this.files[0];
            const reader = new FileReader();

            reader.addEventListener("load", function () {
                imagePreview.src = reader.result;
                imagePreview.style.display = "block";
            });

            reader.readAsDataURL(file);
        });

        categorySelect.addEventListener("change", () => {
            const selectedValue = categorySelect.value;
            if (selectedValue === "lost&found") {
                addressInput.style.display = "block";
            } else {
                addressInput.style.display = "none";
            }
        });

        const handleError = (errorMsg) => {
            errorHandle.hidden = false;
            errorHandle.innerHTML = errorMsg;
        };
    });

})();
