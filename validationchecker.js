import {ObjectId} from "mongodb";

const exportedMethods = {

    checkId(id) {
        if (!id) {
            throw `No id is provided`;
        }
        if (typeof id !== "string" || id.trim().length === 0) {
            throw `The id provided is not a string or an  empty string`;
        }
        id = id.trim()
        if (!ObjectId.isValid(id)) {
            throw `Invalid Object ID`;
        }
        return id;
    },

    checkEmail(email) {
        if (!email) throw "Please provide email";
        if (typeof email !== "string" || email.trim().length <= 0) throw "Please provide a valid email";
        email = email.trim().toLowerCase();
        const emailPrefixRegex = /^[a-z0-9!#$%&'*+\-/=?^_`{|}~.]+@/i;
        const emailPostfixRegex = /@stevens\.edu$/i;
        if (!emailPrefixRegex.test(email)) {
            throw "Email address should contain only letters, numbers, and common special symbols !#$%&'*+\\-/=?^_`{|} before the @ symbol"
        }
        if (!emailPostfixRegex.test(email)) {
            throw "Error: Email address should end with stevens.edu";
        }
        return email;
    },

    checkPassword(password) {
        if (!password) throw "Password not provided";
        if (typeof password !== "string") throw "Password must be a string!";
        password = password.trim();
        if (password.length < 8 || password.length > 25) throw "Password must be at least 8 characters and less than 25 characters";
        const spaceRegex = /\s/;
        const passwordRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/;
        if (!spaceRegex.test(password)) throw "Password must not contain whitespace";
        if (!passwordRegex.test(password)) throw "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special symbol";
        return password;
    },

    checkName(name, valName) {
        if(!name) throw `${valName} not provided`;
        if(typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
        name = name.trim();
        const nameRegex = /^[a-zA-Z]+$/;
        if(!nameRegex.test(name)) throw `${valName} must be only contain character a-z and A-Z`
        return name;
    },

    checkDOB(DOB){
        if(!DOB) throw `DOB not provided`;
        if(typeof DOB !== "string" || DOB.trim().length === 0) throw "Please provide a valid DOB"
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if(!dateRegex.test(DOB)) throw "Invalid date format, should be 'mm-dd-yyyy";
        const[_, month, day, year] = DOB.match(dateRegex);

        const  currentDate = new Date();
        const inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        if(inputDate > currentDate){
            throw "Date of birth must be in the past";
        }
        return inputDate;
    }


};

export default exportedMethods;