const checkPassword = (password) => {
    if (!password) throw "Password not provided";
    if (typeof password !== "string") throw "Password must be a string!";
    password = password.trim();
    if (password.length < 8 || password.length > 25) throw "Password must be at least 8 characters and less than 25 characters";
    const spaceRegex = /\s/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,25}$/;
    if (spaceRegex.test(password)) throw "Password must not contain whitespace";
    if (!passwordRegex.test(password)) throw "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special character";
    return password;
};

const checkEmail = (email) => {
    if (!email) throw "Please provide email";
    if (typeof email !== "string" || email.trim().length <= 0) throw "Please provide a valid email";
    email = email.trim().toLowerCase();
    const emailPrefixRegex = /^[a-z0-9!#$%&'*+\-/=?^_`{|}~.]+@/i;
    const emailPostfixRegex = /@stevens\.edu$/i;
    if (!emailPrefixRegex.test(email)) {
        throw "Email address should contain only letters, numbers, and common special symbols !#$%&'*+\\-/=?^_`{|} before the @ character"
    }
    if (!emailPostfixRegex.test(email)) {
        throw "Error: Email address should end with stevens.edu";
    }
    return email;
};
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
                    email = checkEmail(email);
                    password = checkPassword(password);
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