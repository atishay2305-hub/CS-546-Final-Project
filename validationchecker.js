import {ObjectId} from "mongodb";
import path from "path";
import fs from "fs";

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
            throw "Email address should contain only letters, numbers, and common special symbols !#$%&'*+\\-/=?^_`{|} before the @ character"
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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,25}$/;
        if (spaceRegex.test(password)) throw "Password must not contain whitespace";
        if (!passwordRegex.test(password)) throw "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special character";
        return password;
    },

    checkName(name, valName) {
        if (!name) throw `${valName} not provided`;
        if (typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
        name = name.trim();
        const nameRegex = /^[ a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]+$/;
        if (!nameRegex.test(name)) throw `${valName} must only contain letters, numbers, and common special characters`;
        return name;
    },

    checkLegitName(name, valName) {
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
      
        const minAge = 13;
        const minBirthYear = currentDate.getFullYear() - minAge;
        const birthYear = parseInt(year, 10);
      
        if (birthYear > minBirthYear) {
          throw `You must be at least ${minAge} years old to register`;
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

    checkDepartment(department) {
        if (!department) throw "Department is not provided";
        if (typeof department !== 'string') throw "Department is not a valid type";
        const allowedDepartment = [
            "biomedical engineering", "chemistry and chemical biology", "chemical engineering and materials science",
            "civil, environmental and ocean engineering", "computer science", "electrical and computer engineering",
            "mathematical sciences", "mechanical engineering", "physics"];
        department = department.trim().toLowerCase();
        if (allowedDepartment.includes(department)) {
            return department;
        } else {
            throw "Department select from the existed department from Stevens Institute of Technology.";
        }
    },

    checkAuth(authentication) {
        if (!authentication) return false;
        if (typeof authentication !== "string" || authentication.trim().length === 0) return false;
        authentication = authentication.trim().toLowerCase();
        if (authentication === "getprivilege") {
            return true;
        } else {
            return false;
        }
    },

    checkLocation(building) {
        if (!building) throw `${building} not provided`;
        if (typeof building !== "string" || building.trim().length === 0) throw `Please provide a valid input of building`
        building = building.trim();
        const allowedLocation = [" ",
            "edwin a. stevens hall", "carnegie laboratory", "lieb building", "burchard building",
            "mclean hall", "babbio center", "morton-pierce-kidde complex", "rocco technology center", "nicholl environmental laboratory",
            "davidson laboratory", "gatehouse", "griffith building and building technology tower", "walker gymnasium",
            "schaefer athletic and recreation center", "samuel c. williams library and computer center", "jacobus student center",
            "alexander house", "colonial house"];
        if (!allowedLocation.includes(building)) {
            return building;
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
    },

    getDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hour = ('0' + date.getHours()).slice(-2);
        const minute = ('0' + date.getMinutes()).slice(-2);
        const second = ('0' + date.getSeconds()).slice(-2);
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    },

    async createImage(image) {
        const imageName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
        const dir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const imagePath = path.join(dir, imageName);
        const response = await fetch(image);
        const buffer = await response.buffer();
        await fs.promises.writeFile(imagePath, image, buffer);
        return imagePath;
    },

    async removeImage(image) {
        try {
            await fs.promises.unlink(image);
            console.log(`Image ${image} successfully removed from file system.`);
        } catch (e) {
            console.error(`Error removing image ${image} from file system: ${e}`);
        }
    },

    checkIdentify(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw "ConfirmPassword must be the same as password";
        }
        return true;
    },

    checkCategory(category) {
        if (!category) throw "Category is not provided";
        if (typeof category !== 'string' || category.trim().length === 0) throw "Category is not a valid type";
        category = category.trim().toLowerCase();
        const allowCategories = ["education", "sports", "entertainment", "lost&found"]
        if (allowCategories.includes(category)) {
            return category;
        } else {
            throw "Category must select from the list"
        }
    },

    checkAddress(address){
        if(!address) throw "Address is not provided";
        const addressRegex = /^\s*(\S+(\s+\S+)*)\s*,\s*(\S+(\s+\S+)*)\s*,\s*(\S+)\s*,\s*(\d{5})\s*$/;
        const match = address.match(addressRegex)
        if(match){
            const address = match[1].trim().toLowerCase();
            const city = match[3].trim().toLowerCase();
            const state = match[5].trim().toLowerCase();
            const zip = match[6];

            return `${address}, ${city}, ${state}, ${zip}`;
        }else{
            throw "Invalid address format. Please provide address, city, state, and ZIP code separated by commas";
        }
    }
}


export default exportedMethods;