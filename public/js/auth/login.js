import authCheck from "../validtionChecker.js";

$(document).ready(function () {
    const loginForm = $("#login-form");
    const errorHandle = $("#loginError");
    if (loginForm.length) {
        loginForm.submit(function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();

            const elements = event.target.elements;
            let accessDenied = false;
            errorHandle.hide();

            let email = $("#email").val();
            let password = $("#password").val();

            try {
                email = authCheck.checkEmail(email);
                password = authCheck.checkLoginPass(password);
            } catch (e) {
                $("#email").val(email);
                $("#password").val(password);
                return handleError(e || "Something went wrong");
            }

            $.ajax({
                url: "/login",
                method: "POST",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({ email: email, password: password }),
                success: function (data, textStatus, xhr) {
                    if (xhr.status === 401) {
                        handleError("Wrong email or password");
                        accessDenied = true;
                    } else if (xhr.status !== 200) {
                        if (!data.success) {
                            $("#email").val(data.email);
                            $("#password").val(data.password);
                            handleError(data || "Something went wrong");
                        }
                    } else {
                        accessDenied = false;
                        location.href = "/homepage";
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (xhr.status === 401) {
                        handleError("Wrong email or password");
                        accessDenied = true;
                    } else {
                        handleError(errorThrown || "Something went wrong.");
                    }
                },
            });
        });
    }

    const handleError = (errorMsg) => {
        errorHandle.show().html(errorMsg);
    };
});