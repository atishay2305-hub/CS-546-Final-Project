import authCheck from "../validtionChecker.js";
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const resetPasswordForm = document.getElementById("resetPassword-form");
        const errorHandle = document.getElementById("resetPasswordError");
        if (resetPasswordForm) {

            resetPasswordForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;
                let email = document.getElementById("email").value;
                let newPassword = document.getElementById("newPassword").value;
                let confirmNewPassword = document.getElementById("confirmNewPassword").value;

                try {
                    email = authCheck.checkEmail(email);
                    newPassword = authCheck.checkPassword(newPassword);
                    confirmNewPassword = authCheck.checkPassword(confirmNewPassword);
                    authCheck.checkIdentify(newPassword, confirmNewPassword);

                } catch (e) {
                    document.getElementById("email").setAttribute("value", email);
                    document.getElementById("newPassword").setAttribute("value", newPassword);
                    document.getElementById("confirmNewPassword").setAttribute("value", confirmNewPassword);
                    return handleError(e || "Something went wrong");
                }
                fetch("/reset-password/:id", {
                    method: "post",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        newPassword: newPassword,
                        confirmNewPassword: confirmNewPassword
                    }),
                }).then((res) => {
                    if(!res.ok){
                        return res.json();
                    }

                }).then((data) => {
                    if (data) {
                        if (!data.success) {
                            document.getElementById("email").value = data.email;
                            document.getElementById("newPassword").value = data.newPassword;
                            document.getElementById("confirmNewPassword").value = data.confirmNewPassword;
                            return handleError(data || "Something went wrong.");
                        }
                    }
                    location.href = "/login";
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