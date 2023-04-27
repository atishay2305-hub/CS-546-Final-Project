import authCheck from "./validationChecker.js"
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginForm = document.getElementById("login-form");
        const errorHandle = document.getElementById("errorHandle");
        let emailIn = document.getElementById("email");
        let passwordIn = document.getElementById("password");
        if (loginForm) {
            loginForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;
                let email = emailIn.value;
                let password = passwordIn.value;
                try {
                    email = authCheck.checkEmail(email);
                    password = authCheck.checkPassword(password);
                } catch (e) {
                    document.getElementById("email").setAttribute("value", email);
                    document.getElementById("password").setAttribute("value", password);
                    return handleError(e.message || "Something went wrong");
                }
                fetch("/login", {
                    method: "post", headers: {
                        Accept: "application/json, text/plain, */*", "Content-Type": "application/json",
                    }, body: JSON.stringify({
                        email: email, password: password
                    }),
                }).then((res) => {
                    if (res.status === 401) {
                        handleError("Wrong username or password");
                        return null;
                    } else {
                        return res.json();
                    }
                }).then((response) => {
                        if (response) {
                            if (response.success) {
                                sessionStorage.setItem("user", JSON.stringify(response.data));
                                location.herf = '/';
                            } else {
                                return handleError(response.message || "Something went wrong.");
                            }
                        }
                    }).catch((e) => {
                        alert(e.errmsg || "Something went wrong.");
                    });
            });
        }
        const handleError = (errorMsg) => {
            errorHandle.hidden = false;
            errorHandle.innerHTML = errorMsg;
        };
    });
})();