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
        const nameRegex = /^[ a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+$/;
        if (!nameRegex.test(name)) throw `${valName} must be only contain character a-z and A-Z`
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

    checkString(strVal, varName){
      if(!strVal) {
          throw `Error: You must supply a ${varName}`;
      }
      if(typeof strVal !== 'string') {
          throw `Error: ${varName} must be a string!`;
      }
      strVal = strVal.trim();
      if(strVal.length === 0){
          throw `Error: ${varName} cannot be an empty string or string with just spaces`;
      }
      if(!isNaN(strVal)){
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
      }
      return strVal;
  },

  checkSeating(seatingCapacityVal, varName){
    if(typeof(seatingCapacityVal) !== "number"){
        throw "The seating Capacity should be of type number."
      }
      if(seatingCapacityVal.toFixed(1) < 0){
        throw "Seating capacity should not be less than 0."
      }
      return seatingCapacityVal;
},


    checkPostEventConditions(event){
        if (!event) {
          throw "No event data provided.";
        }
      
        if (typeof event !== "object") {
          throw "Event data should be an object.";
        }
      
        if (!event.eventName) {
          throw "You must provide a name for the event.";
        }
      
        if (typeof event.eventName !== "string") {
          throw "The event name should be a string.";
        }
      
        if (event.eventName.trim().length === 0) {
          throw "Event name cannot be an empty string or just spaces.";
        }
      
        if (!event.description) {
          throw "You must provide a description for the event.";
        }
      
        if (typeof event.description !== "string") {
          throw "The description should be a string.";
        }
      
        if (event.description.trim().length === 0) {
          throw "Description cannot be an empty string or just spaces.";
        }
      
        if (!event.buildingName) {
          throw "You must provide a building name for the event.";
        }
      
        if (typeof event.buildingName !== "string") {
          throw "The building name should be a string.";
        }
      
        if (event.buildingName.trim().length === 0) {
          throw "Building name cannot be an empty string or just spaces.";
        }
      
        if (!event.organizer) {
          throw "You must provide an organizer for the event.";
        }
      
        if (typeof event.organizer !== "string") {
          throw "The organizer should be a string.";
        }
      
        if (event.organizer.trim().length === 0) {
          throw "Organizer cannot be an empty string or just spaces.";
        }
      
        if (!event.seatingCapacity) {
          throw "You must provide seating capacity for the event.";
        }
      
        if (typeof event.seatingCapacity !== "number") {
          throw "The seating capacity should be a number.";
        }
      
        if (event.seatingCapacity <= 0) {
          throw "The seating capacity must be a positive number.";
        }
      
        // Validate any other fields that you require here.
      
        const validatedEvent = {
          eventName: event.eventName,
          description: event.description,
          buildingName: event.buildingName,
          organizer: event.organizer,
          seatingCapacity: event.seatingCapacity,
          userId: event.userId,
          // Include any other validated fields here.
        };
      
        return validatedEvent;
      }
      
      


};

export default exportedMethods;