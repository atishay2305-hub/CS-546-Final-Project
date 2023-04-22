import {events, posts, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {userData} from "./index.js";


let exportedMethods = {
    async createEvent(
        userId,
        eventName,
        description,
        buildingName,
        organizer,
        seatingCapacity,
        image
    ) {
        eventName = validation.checkName(eventName, "EventName");
        description = validation.checkPhrases(description, "Description");
        buildingName = validation.checkLocation(buildingName, "BuildingName");
        organizer = validation.checkName(organizer, "Organizer");
        seatingCapacity = validation.checkCapacity(seatingCapacity);
        userId = validation.checkId(userId);

        const user = await users().findOne({_id: new ObjectId(userId)});
        if (user.isAdmin === undefined || !user.isAdmin) {
            throw `Only administrator can edit events`
        }
        let path = "";
        if (!image || image.trim().length === 0) {
            path = "public/images/default.png";
        } else {
            path = validation.createImage(image);
        }

        let event = {
            eventName: eventName,
            description: description,
            date: validation.getDate(),
            buildingName: buildingName,
            organizer: organizer,
            attendees: {},
            seatingCapacity: seatingCapacity,
            commentIds: [],
            image: path,
        }

        const insertInfo = await events().insertOne(event);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add event";
        if (userId) {
            await userData.putEvent(insertInfo.insertedId.toString(), userId);
        }
        event._id = insertInfo.insertedId.toString();
        event = Object.assign({_id: event._id}, event);
        return event;
    },

    async getAllEvents(projection) {
        const eventCollection = await events();
        return eventCollection.find({}).sort({created_Date: -1}).toArray();
    },
    
    async getEventByID(id) {
        id = validation.checkId(id);
        // console.log(events());
        const eventCollection = await events();
        const event = eventCollection.findOne({_id: new ObjectId(id)});
        if (event === null) throw "No event with that id";
        event._id = new ObjectId(event._id).toString();
        return event;
    },
    

    async getEventByEmail(email) {
        email = validation.checkEmail(email);
        let eventIdsList = await userData.getEventList(email);
        return await Promise.all(
            eventIdsList.map(async (eventId) => {
                return await this.getEventByID(eventId);
            })
        );
    },

    async removeEventById(id) {
        id = await validation.checkId(id);
        const eventCollection = await events();
        const event = eventCollection.findOne({_id: new ObjectId(id)});
        if (event === null) throw "No event with that id";
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(event.userId)});
        // if (user.isAdmin === undefined || !user.isAdmin) throw "Only administrators can delete events.";
        const removeEvent = eventCollection.deleteOne({_id: new ObjectId(id)});
        if (removeEvent.deletedCount === 0) {
            throw `Could not delete band with id of ${id}`;
        }
        // await userData.removeEvent(event.userId.toString(), id);
        return {
            eventId: id,
            deleted: true
        };
    },

    async updateEvent(
        id,
        userId,
        eventName,
        description,
        buildingName,
        organizer,
        seatingCapacity,
        image
    ) {
        id = validation.checkId(id);
        userId = validation.checkId(userId);
        eventName = validation.checkName(eventName, "EventName");
        description = validation.checkPhrases(description, "Description");
        buildingName = validation.checkLocation(buildingName, "Building Name");
        organizer = validation.checkName(organizer, "Organizer");
        seatingCapacity = validation.checkCapacity(seatingCapacity, "SeatingCapacity");
        let path = "";
        if (!image || image.trim().length === 0) {
            path = "public/images/default.png";
        } else {
            path = validation.createImage(image);
        }
        const checkEventExist = await events().findOne({_id: new ObjectId(id)});
        if (!checkEventExist) throw `Event is not exist with that ${id}`;
        const user = await users().findOne({_id: new ObjectId(userId)})
        if (user.isAdmin === undefined || !user.isAdmin) throw "Only administrators can update events."
        let evenData = {
            eventName: eventName,
            description: description,
            date: validation.getDate(),
            buildingName: buildingName,
            organizer: organizer,
            seatingCapacity: seatingCapacity,
            image: path
        }

        let event = await events().updateOne({_id: new ObjectId(id)}, {$set: evenData});
        if (!event.acknowledged || event.matchedCount !== 1) {
            throw "Could not update record with that ID.";
        }
        return await events().findOne({_id: new ObjectId(id)});
    },



}

export default exportedMethods;