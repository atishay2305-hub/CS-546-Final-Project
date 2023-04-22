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
        if (typeof DOB !== "string" || DOB.trim().length === 0) throw "Please provide a valid DOB"
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!dateRegex.test(DOB)) throw "Invalid date format, should be 'mm-dd-yyyy";
        const [_, month, day, year] = DOB.match(dateRegex);

        const currentDate = new Date();
        const inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        if (inputDate > currentDate) {
            throw "Date of birth must be in the past";
        }
        return inputDate;
    },

    checkLocation(buildingName, valName) {
        if (!buildingName) throw `${valName} not provided`;
        if (typeof buildingName !== "string" || buildingName.trim().length === 0) throw `Please provide a valid input of ${valName}`
        const allowedLocation = ["edwin a. stevens hall", "carnegie laboratory", "lieb building", "burchard building",
            "mclean hall", "babbio center", "morton-pierce-kidde complex", "rocco technology center", "nicholl environmental laboratory",
            "davidson laboratory", "gatehouse", "griffith building and building technology tower", "walker gymnasium",
            "schaefer athletic and recreation center", "samuel c. williams library and computer center", "jacobus student center",
            "alexander house", "colonial house"];
        buildingName = buildingName.trim().toLowerCase();
        if(!allowedLocation.find(loc => buildingName.startsWith(loc))){
            throw "Location must be on Stevens Institute of Technology main campus.";
        }
        return buildingName;
    },

    checkCapacity(seatCapacity){
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
        const day = ('0' + date.getDay()).slice(-2);
        const hour = ('0' +date.getHours()).slice(-2);
        const minute = ('0' +date.getMinutes()).slice(-2);
        const second = ('0' +date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
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

    async removeImage(image){
        try{
            await fs.promises.unlink(image);
            console.log(`Image ${image} successfully removed from file system.`);
        }catch (e){
            console.error(`Error removing image ${image} from file system: ${e}`);
        }
    },

};

export default exportedMethods;