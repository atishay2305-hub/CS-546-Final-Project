import authCheck from "../validtionChecker.js";
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const registerForm = document.getElementById("register-Form");
        const errorHandle = document.getElementById("registerError");
        let firstNameIn = document.getElementById("FN");
        let lastNameIn = document.getElementById("LN");
        let userNameIn = document.getElementById("UN");
        let emailIn = document.getElementById("email");
        let passwordIn = document.getElementById("password");
        let confirmPasswordIn = document.getElementById("CP");
        let DOBIn = document.getElementById("DOB");
        let roleIn = document.getElementById("role");
        let departmentIn = document.getElementById("department");
        if (registerForm) {
            registerForm.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                const elements = event.target.elements;
                errorHandle.hidden = true;

                let firstName = firstNameIn.value;
                let lastName = lastNameIn.value;
                let userName = userNameIn.value;
                let email = emailIn.value;
                let password = passwordIn.value;
                let confirmPassword = confirmPasswordIn.value;
                let DOB = DOBIn.value;
                let role = roleIn.value;
                let department = departmentIn.value;
                let authentication = "";

                try {
                    firstName = authCheck.checkLegitName(firstName, "First Name");
                    lastName = authCheck.checkLegitName(lastName, "Last Name");
                    userName = authCheck.checkName(userName, "User Name");
                    email = authCheck.checkEmail(email);
                    password = authCheck.checkPassword(password);
                    confirmPassword = authCheck.checkPassword(confirmPassword, true, password);
                    DOB = authCheck.checkDOB(DOB);
                    role = authCheck.checkRole(role);
                    department = authCheck.checkDepartment(department);
                    authCheck.checkIdentify(password, confirmPassword);
                    if (role === 'admin') {
                        authentication = document.getElementById("authentication");
                        authentication = authCheck.checkAuth(authentication.value);
                    }
                } catch (e) {
                    document.getElementById("FN").setAttribute("value", firstName);
                    document.getElementById("LN").setAttribute("value", lastName);
                    document.getElementById("UN").setAttribute("value", userName);
                    document.getElementById("email").setAttribute("value", email);
                    document.getElementById("password").setAttribute("value", password);
                    document.getElementById("CP").setAttribute("value", confirmPassword);
                    document.getElementById("DOB").setAttribute("value", DOB);
                    document.getElementById("role").setAttribute("value", role);
                    document.getElementById("department").setAttribute("value", department);
                    document.getElementById("authentication").setAttribute("value", authentication);
                    return handleError(e || "Something went wrong");
                }

                fetch("/register", {
                    method: "post",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        userName: userName,
                        email: email,
                        password: password,
                        DOB: DOB,
                        role: role,
                        department: department,
                        confirmPassword: confirmPassword,
                        authentication: authentication
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
                                document.getElementById("FN").value = data.firstName;
                                document.getElementById("LN").value = data.lastName;
                                document.getElementById("UN").value = data.userName;
                                document.getElementById("email").value = data.email;
                                document.getElementById("password").value = data.password;
                                document.getElementById("DOB").value = data.DOB;
                                document.getElementById("role").value = data.role;
                                document.getElementById("department").value = data.department;
                                document.getElementById("authentication").value = data.authentication;
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

