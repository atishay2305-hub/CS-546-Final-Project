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
        if (seatingCapacity < 0 || seatingCapacity > 100) {
            throw `SeatingCapacity only available between 0 -100`;
        }
        name = eventName.trim();
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
    }
};

export default exportedMethods;