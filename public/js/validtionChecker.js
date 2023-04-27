const authCheck = {
    checkLegitName(name, valName) {
        if (!name) throw `${valName} not provided`;
        if (typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
        name = name.trim();
        const nameRegex = /^[ a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]+$/;
        if (!nameRegex.test(name)) throw `${valName} must only contain letters, numbers, and common special characters`;
        return name;
    },

    checkName(name, valName) {
        if (!name) throw `${valName} not provided`;
        if (typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
        name = name.trim();
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(name)) throw `${valName} must be only contain character a-z and A-Z`;
        if (name.length < 2) throw `${valName} length must greater than 2 words`;
        if (name.length > 20) throw `${valName} length must less than 20 words`;
        return name;
    },

    checkLoginPass(password){
        if (!password) throw "Password not provided";
        if (password.length < 8 || password.length > 25) throw "Password must be at least 8 characters and less than 25 characters";
        return password;
    },

    checkPassword(password) {
        if (!password) throw "Password not provided";
        password = password.trim();
        if (password.length < 8 || password.length > 25) throw "Password must be at least 8 characters and less than 25 characters";
        const spaceRegex = /\s/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,25}$/;
        if (spaceRegex.test(password)) throw "Password must not contain whitespace";
        if (!passwordRegex.test(password)) throw "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special character";
        return password;
    },

    checkIdentify(password, confirmPassword){
        if(password !== confirmPassword){
            throw "ConfirmPassword must be the same as password";
        }

    },
    checkEmail(email) {
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
    },

    checkDOB(DOB) {
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
    },

    checkRole(role) {
        if (!role) throw  "Role is not provided";
        if (typeof role !== "string" || role.trim().length === 0) throw "Role is not a valid type";
        role = role.trim().toLowerCase();
        if (role !== "admin" && role !== "user") throw "Please select a role";
        return role
    },

    checkAuth(authMsg) {
        if (!authMsg) throw "Authentication code is not provided";
        if (typeof authMsg !== "string" || authMsg.trim().length === 0) throw "Authentication code is not a valid type";
        authMsg = authMsg.trim().toLowerCase();
        const code = "getprivilege";
        if (authMsg !== code) {
            throw "Authentication code is not correct";
        }
        return authMsg;
    },

    checkDepartment(department) {
        if (!department) throw "Department is not provided";
        if (typeof department !== 'string') throw "Department is not a valid type";
        const allowedDepartment = ["biomedical Engineering", "chemistry and chemical biology", "chemical engineering and materials science", "civil, environmental and ocean engineering", "computer science", "electrical and computer engineering", "mathematical sciences", "mechanical engineering", "physics"];
        department = department.trim().toLowerCase();
        if (allowedDepartment.includes(department)) {
            return department;
        } else {
            throw "Department select from the existed department from Stevens Institute of Technology.";
        }
    },

    checkCategory(category){
        if (!category) throw "Category is not provided";
        if (typeof category !== 'string' || category.trim().length === 0) throw "Category is not a valid type";
        category = category.trim().toLowerCase();
        const allowCategories = ["education", "sport", "entertainment"]
        if(allowCategories.includes(category)){
            return category;
        }else{
            throw "Category must select from the list"
        }
    },

    checkPhrases(phrase, valName) {
        if (!phrase) throw `${valName} not provided`;
        if (typeof phrase !== "string" || phrase.trim().length === 0) throw `Please provide a valid input of ${valName}`
        phrase = phrase.trim();
        if (phrase.length < 5)
            throw `${valName} length must greater than 5 characters`;
        if (phrase.length > 300)
            throw `${valName} length must less than 300 characters`;
        return phrase;
    },

    checkLocation(building) {
        if (!building) throw `${building} not provided`;
        if (typeof building !== "number") throw `Please provide a valid input of buildingIndex`
        const allowedLocation = [" ",
            "edwin a. stevens hall", "carnegie laboratory", "lieb building", "burchard building",
            "mclean hall", "babbio center", "morton-pierce-kidde complex", "rocco technology center", "nicholl environmental laboratory",
            "davidson laboratory", "gatehouse", "griffith building and building technology tower", "walker gymnasium",
            "schaefer athletic and recreation center", "samuel c. williams library and computer center", "jacobus student center",
            "alexander house", "colonial house"];
        if (building !== 0 && allowedLocation[building]) {
            return allowedLocation[building];
        } else {
            throw "Location must be on Stevens Institute of Technology main campus.";
        }
    },

    checkCapacity(seatCapacity) {
        if (!seatCapacity) throw "seatCapacity not provided.";
        if (typeof seatCapacity !== "number") throw "Please provide a number."
        if (seatCapacity < 5)
            throw "seatCapacity must greater than 10";
        if (seatCapacity > 300)
            throw "seatCapacity must less than 300";
        return seatCapacity;
    }
}
export default authCheck;
