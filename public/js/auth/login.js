import authCheck from "../validtionChecker.js";
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginForm = document.getElementById("login-form");
        const errorHandle = document.getElementById("loginError");
        if (loginForm) {

            loginForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;

                let email = document.getElementById("email").value;
                let password = document.getElementById("password").value;

                try {
                    email = authCheck.checkEmail(email);
                    password = authCheck.checkLoginPass(password);
                } catch (e) {
                    document.getElementById("email").setAttribute("value", email);
                    document.getElementById("password").setAttribute("value", password);
                    return handleError(e || "Something went wrong");
                }

                fetch("/login", {
                    method: "post",
                    headers: {
                        Accept: "application/json, text/plain, */*", "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
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
                                document.getElementById("email").value = response.email;
                                document.getElementById("password").value = response.password;
                                return handleError(response || "Something went wrong.");
                            }
                        }
                    }).catch((e) => {
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