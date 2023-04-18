import {events, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import path from 'path';
import fs from 'fs';
import {userData} from "./index.js";

let exportedMethods = {
    async createEvent(
        eventName,
        description,
        buildingName,
        organizer,
        seatingCapacity,
        image,
        userId
    ){
        eventName = validation.checkName(eventName, "EventName");
        description = validation.checkPhrases(description, "Description");
        buildingName = validation.checkLocation(buildingName, "BuildingName");
        organizer = validation.checkName(organizer, "Organizer");
        seatingCapacity = validation.checkCapacity(seatingCapacity);
        userId = validation.checkId(userId);

        const userCollection = await users();
        const checkAdmin = await userCollection.findOne({_id: new ObjectId(userId)});
        if(!checkAdmin.isAdmin){
            throw `Only administrator can edit events`
        }
        let path = "";
        if(!image || image.trim().length === 0){
            path = "public/images/default.png";
        }else{
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
            comments: {},
            image: path,
        }

        const eventCollection = await events();
        const insertInfo = await eventCollection.insertOne(event);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw `Could not add event`;
        }
        if(userId){
            await userData.putEvent(insertInfo.insertedId.toString(), userId);
        }
        event._id = insertInfo.insertedId.toString();
        event = Object.assign({_id: event._id}, event);
        return event;
    },

    async removeImage(image){
        try{
            await fs.promises.unlink(image);
            console.log(`Image ${image} successfully removed from file system.`);
        }catch (e){
            console.error(`Error removing image ${image} from file system: ${e}`);
        }
    },

    async getAllEvent(projection) {
        const eventCollection = await events();
        let eventsList = undefined;
        if (!projection) {
            eventsList = await eventCollection.find({}).toArray();
        } else {
            eventsList = await eventCollection.find({}).project(projection).toArray();
        }
        if (!eventsList) throw `Could not get all events`;
        eventsList = eventsList.map(element => {
            element._id = element._id.toString();
            return element;
        });
        return eventsList;
    },

    async getEventByID(id) {
        id = await validation.checkId(id);
        const eventCollection = await events();
        const event = await eventCollection.findOne({_id: new ObjectId(id)});
        if (event === null) {
            throw `No event with that id`;
        }
        event._id = new ObjectId(event._id).toString();
        return event;
    },

    async removeEventById(id) {
        id = await validation.checkId(id);
        const eventCollection = await events();
        const removeEvent = await eventCollection.deleteOne({_id: new ObjectId(id)});
        if (removeEvent.deletedCount === 0) {
            throw `Could not delete band with id of ${id}`;
        }
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
        location,
        organizer,
        seatingCapacity,
    ) {

        id = validation.checkId(id);
        eventName = validation.checkName(eventName, "EventName");
        description = validation.checkPhrases(description, "Description");
        location = validation.checkLocation(location, "Location");
        organizer = validation.checkName(organizer, "Organizer");
        seatingCapacity = validation.checkCapacity(seatingCapacity, "SeatingCapacity");
        const userCollection = await users();
        const eventCollection = await events();
        const checkEventExist = eventCollection.findOne({_id: new ObjectId(id)});
        if (!checkEventExist) throw `Event is not exist with that ${id}`;
        const checkAdmin = await userCollection.findOne({_id: new ObjectId(userId)})
        if (!checkAdmin.isAdmin) throw "You're ineligible to edit event"
        let evenData = {
            eventName: eventName,
            description: description,
            data: validation.getDate(),
            location: location,
            organizer: organizer,
            seatingCapacity: seatingCapacity,
        }

        let event = await eventCollection.updateOne({_id: new ObjectId(id)}, {$set: evenData});
        if (!event.acknowledged || event.matchedCount !== 1) {
            throw `could not update record with that ID`;
        }
        return await eventCollection.findOne({_id: new ObjectId(id)});
    },
    
    async getEventByAdmin (email){
        email = validation.checkEmail(email);
        let eventIdsList = await userData.getEventList(email);
        return await Promise.all(
            eventIdsList.map(async (eventId) => {
                return await this.getEventByID(eventId);
            })
        );
    }
    
}

export default exportedMethods;