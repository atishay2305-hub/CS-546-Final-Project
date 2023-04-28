import validation from '/validationchecker.js';

$(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const registerForm = document.getElementById('registrationForm');
        const errorHandle = document.getElementById("registerError");
        if (registerForm) {
            registerForm.addEventListener('submit', (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const form = event.target.elements;
                errorHandle.hidden = true;

                let firstName = document.getElementById('FN').value;
                let lastName = document.getElementById('LN').value;
                let userName = document.getElementById('UN').value;
                let email = document.getElementById('email').value;
                let password = document.getElementById('password').value;
                let DOB = document.getElementById('DOB').value;
                let role = document.getElementById('role').selectedIndex;

                try {
                    firstName = validation.checkLegitName(firstName, "First Name");
                    lastName = validation.checkLegitName(lastName, "Last Name");
                    userName = validation.checkName(userName, "User Name");
                    email = validation.checkEmail(email);
                    password = validation.checkPassword(password);
                    DOB = validation.checkDOB(DOB);
                    role = validation.checkRole(role);
                } catch (e) {
                    document.getElementById('FN').setAttribute("value", firstName);
                    document.getElementById('LN').setAttribute("value", lastName);
                    document.getElementById('UN').setAttribute("value", userName);
                    document.getElementById("email").setAttribute("value", email);
                    document.getElementById("password").setAttribute("value", password);
                    document.getElementById("DOB").setAttribute("value", DOB);
                    return handleError(e.message || "Something went wrong");
                }

                fetch('/register', {
                    method: "post",
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        "Content-type": 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        userName: userName,
                        email: email,
                        password: password,
                        DOB: DOB,
                        dept: dept
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        if (data) {
                            if (data.success === false) {
                                document.getElementById('FN').setAttribute("value", firstName);
                                document.getElementById('LN').setAttribute("value", lastName);
                                document.getElementById('UN').setAttribute("value", userName);
                                document.getElementById("email").setAttribute("value", email);
                                document.getElementById("password").setAttribute("value", password);
                                document.getElementById("DOB").setAttribute("value", DOB);
                                return handleError(data.message || "Something went wrong");
                            }
                        }
                        location.href = '/login';
                        return;

                    })
                    .catch((error) => {
                        alert(error.message || "Something went wrong.");
                    });
            });
        }
        function handleError(errorMsg){
            errorHandle.hidden = false;
            errorHandle.innerHTML = errorMsg;
        }
    })
})

