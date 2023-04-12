import {ObjectId} from "mongodb";
import {events} from "./config/mongoCollections.js";

const exportedMethods = {
    async checkEventId(id) {
        if (!id) {
            throw `No id is provided`;
        }
        if (typeof id !== "string" || id.trim().length === 0) {
            throw `The id provided is not a string or an  empty string`;
        }
        if (!ObjectId.isValid(id)) {
            throw `Invalid Object ID`;
        }
        id = id.trim();
        const bandCollection = await events();
        const getBand = await bandCollection.findOne({_id: new ObjectId(id)});
        if (getBand === null) {
            throw `No event with that id`;
        }
        return id;
    },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
      },
      
    async checkEventConditions(
        eventName,
        description,
        date,
        time,
        location,
        organizer,
        seatingCapacity) {
        if (!eventName) {
            throw `Eventname not provided`;
        }
        if (!description) {
            throw "Description not provided";
        }
        if (!date) {
            throw `Date not provided`;
        }
        if (!time) {
            throw `Time not provided`;
        }
        if (!location) {
            throw `Location not provided`;
        }
        if (!organizer) {
            throw `Organizer not provided`;
        }
        if (!seatingCapacity) {
            throw `SeatingCapacity not provided`
        }
        if (typeof eventName !== "string" || eventName.trim().length === 0) {
            throw `EventName is not string or empty string`;
        }
        if (typeof description !== "string" || description.trim().length === 0) {
            throw `Description is not string or empty string`;
        }
        if (typeof date !== "string" || date.trim().length === 0) {
            throw `date is not string or empty string`;
        }
        if (typeof time !== "string" || time.trim().length === 0) {
            throw `time is not string or empty string`;
        }
        if (typeof location !== "string" || location.trim().length === 0) {
            throw `Location is not string or empty string`;
        }
        if (typeof organizer !== "string" || organizer.trim().length === 0) {
            throw `Organizer is not string or empty string`;
        }
        if (typeof seatingCapacity !== "number") {
            throw `YearBandWasFormed is not a number`;
        }
        if (seatingCapacity < 0 || seatingCapacity > 1000) {
            throw `SeatingCapacity only available between 0 - 1000`;
        }
        eventName = eventName.trim();
        description = description.trim();
        date = date.trim();
        time = time.trim();
        location = location.trim();
        organizer = organizer.trim();
        return {
            eventName: eventName,
            description: description,
            date: date,
            time: time,
            location: location,
            organizer: organizer,
            seatingCapacity: seatingCapacity,
        }
    },
    async checkPostEventConditions(postData){
        const requiredFields = ["eventName", "description", "date",
            "time", "location", "organizer", "seatingCapacity"];
        requiredFields.forEach(element => {
            if (!postData[element] || postData[element] === null) {
                throw `There are no fields in the request body`;
            }
        });
        await this.checkEventConditions(postData.eventName, postData.description, postData.date,
            postData.time, postData.location, postData.organizer, postData.seatingCapacity);

        postData.eventName = postData.eventName.trim();
        postData.description = postData.description.trim();
        postData.date = postData.date.trim();
        postData.time = postData.time.trim();
        postData.location = postData.location.trim();
        postData.organizer = postData.organizer.trim();
        return {
            eventName: postData.eventName,
            description: postData.description,
            date: postData.date,
            time: postData.time,
            location: postData.location,
            organizer: postData.organizer,
            seatingCapacity: postData.seatingCapacity
        };
    }
};

export default exportedMethods;