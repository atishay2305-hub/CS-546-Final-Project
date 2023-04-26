const checkLegitName =(name, valName)=> {
    if (!name) throw `${valName} not provided`;
    if (typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
    name = name.trim();
    const nameRegex = /^[ a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]+$/;
    if (!nameRegex.test(name)) throw `${valName} must only contain letters, numbers, and common special characters`;
    return name;
};

const checkName = (name, valName)=> {
    if (!name) throw `${valName} not provided`;
    if (typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
    name = name.trim();
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(name)) throw `${valName} must be only contain character a-z and A-Z`;
    if (name.length < 2)
        throw `${valName} length must greater than 2 words`;
    if (name.length > 20)
        throw `${valName} length must less than 20 words`;
    return name;
};

const checkPassword = (password)=> {
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

const checkEmail = (email)=> {
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

const checkDOB = (DOB)=> {
    if (!DOB) throw `DOB not provided`;
    if (typeof DOB !== "string" || DOB.trim().length === 0) throw "Please provide a valid DOB";
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!dateRegex.test(DOB)) throw "Invalid date format, should be 'yyyy-mm-dd'";
    const [_, year, month, day] = DOB.match(dateRegex);

    const currentDate = new Date();

    if (DOB > currentDate) {
        throw "Date of birth must be in the past";
    }
    return DOB;
};

const checkRole = (role)=> {
    if (!role) throw  "Role is not provided";
    if (typeof role !== "string" || role.trim().length === 0) throw "Role is not a valid type";
    role = role.trim().toLowerCase();
    if (role !== "admin" && role !== "user") throw "Please select a role";
    return role
};

const checkAuth = (authMsg) => {
    if(authMsg) throw "Authentication code is not provided";
    if(typeof authMsg !== "string" || authMsg.trim().length === 0) throw "Authentication code is not a valid type";
    authMsg = authMsg.trim().toLowerCase();
    const code = "getprivilege";
    if(authMsg !== code){
        throw "Authentication code is not correct";
    }
    return authMsg;
}

const checkDepartment = (department)=> {
    if (!department) throw "Department is not provided";
    if (typeof department !== 'string') throw "Department is not a valid type";
    const allowedDepartment = [
        "biomedical Engineering", "chemistry and chemical biology", "chemical engineering and materials science",
        "civil, environmental and ocean engineering", "computer science", "electrical and computer engineering",
        "mathematical sciences", "mechanical engineering", "physics"];
    department = department.trim().toLowerCase();
    if (allowedDepartment.includes(department)) {
        return department;
    } else {
        throw "Department select from the existed department from Stevens Institute of Technology.";
    }
};
const handleError = (errorMsg) => {
    errorHandle.hidden = false;
    errorHandle.innerHTML = errorMsg;
};

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const registerForm = document.getElementById("registrationForm");
        const auth = document.getElementById("auth").value;
        const errorHandle = document.getElementById("errorHandle");

        if (registerForm) {
            registerForm.addEventListener("submit", (event) => {
                event.preventDefault();

                errorHandle.hidden = true;
                auth.hidden = true;

                let firstName = document.getElementById("FN").value;
                let lastName = document.getElementById("LN").value;
                let userName = document.getElementById("UN").value;
                let email = document.getElementById("email").value;
                let password = document.getElementById("password").value;
                let confirmPassword = document.getElementById("CP").value;
                let DOB = document.getElementById("DOB").value;
                let role = document.getElementById("role").value;
                let department = document.getElementById("department").value;
                let authentication = "";

                try {
                    firstName = checkLegitName(firstName, "First Name");
                    lastName = checkLegitName(lastName, "Last Name");
                    userName = checkLegitName(userName, "User Name");
                    email = checkEmail(email);
                    password = checkPassword(password);
                    confirmPassword = checkPassword(confirmPassword, true, password);
                    DOB = checkDOB(DOB);
                    role = checkRole(role);
                    department = checkDepartment(department);
                    if(role === 'admin'){
                        auth.hidden = false;
                        authentication = document.getElementById('authentication').value;
                        authentication = checkAuth(authentication);
                    }
                } catch (e) {
                    document.getElementById("FN").value = firstName;
                    document.getElementById("LN").value = lastName;
                    document.getElementById("UN").value = userName;
                    document.getElementById("email").value = email;
                    document.getElementById("password").value = password;
                    document.getElementById("CP").value = confirmPassword;
                    document.getElementById("DOB").value = DOB;
                    document.getElementById("role").value = role;
                    document.getElementById("department").value = department;
                    document.getElementById("authentication").value = authentication;
                    return handleError(e.message || "Something went wrong");
                }

                fetch("/register", {
                    method: "post",

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
                })
                    .then((response) => {
                        if (!response.ok) {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        if (data) {
                            if (data.success === false) {
                                document.getElementById("FN").value = firstName;
                                document.getElementById("LN").value = lastName;
                                document.getElementById("UN").value = userName;
                                document.getElementById("email").value = email;
                                document.getElementById("password").value = password;
                                document.getElementById("CP").value = confirmPassword;
                                document.getElementById("DOB").value = DOB;
                                document.getElementById("role").value;
                                document.getElementById("department").value;
                                document.getElementById("authentication").value;
                                return handleError(
                                    data.message || "Something went wrong"
                                );
                            }
                        }
                        location.href = "/login";
                        return;
                    })
                    .catch((error) => {
                        alert(error.message || "Something went wrong.");
                    });
            });
        }
    });
})();

