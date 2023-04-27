import authCheck from "../validtionChecker.js";
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const registerForm = document.getElementById("creatPost-form");
        const errorHandle = document.getElementById("create-postError");
        let categoryIn = document.getElementById("postCategory");
        let postContentIn = document.getElementById("postContent");

        if (registerForm) {
            registerForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;

                let category = categoryIn.value;
                let postContent = postContentIn.value;


                try {
                    category = authCheck.checkCategory(category);
                    postContent = authCheck.checkPhrases(postContent, "Post Content");

                } catch (e) {
                    document.getElementById("postCategory").setAttribute("value", category);
                    document.getElementById("postContent").setAttribute("content", postContent);
                    return handleError(e || "Something went wrong");
                }
                fetch("/posts", {
                    method: "post",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: category,
                        postContent: postContent
                    }),
                }).then((response) => {
                    if(!response.ok){
                        return response.json();
                    }
                }).then((data) => {
                    if (data) {
                        if (data.success) {
                            location.href = "/login";
                            sessionStorage.setItem("user", JSON.stringify(data.data));
                        }else{
                            document.getElementById("postCategory").value = data.category;
                            document.getElementById("postContent").value = data.postContent;
                            return handleError(data || "Something went wrong");
                        }
                    }
                })
                    .catch((e) => {
                        alert(e || "Something went wrong.");
                    });
            });
        }
        const handleError = (errorMsg) => {
            errorHandle.hidden = false;
            errorHandle.innerHTML = errorMsg;
        };
    });

})();
