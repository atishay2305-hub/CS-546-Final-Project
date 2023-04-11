import {events} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";

let exportedMethods = {
    async createEvent(
        eventName,
        description,
        date,
        time,
        location,
        organizer,
        seatingCapacity,
    ){
        let evenData = await validation.checkEventConditions(
            eventName,
            description,
            date,
            time,
            location,
            organizer,
            seatingCapacity
    );
        const eventCollection = await events();
        let event = {
            eventName: evenData.eventName,
            description: evenData.description,
            data: evenData.date,
            time: evenData.time,
            location: evenData.location,
            organizer: evenData.organizer,
            attendees: {},
            seatingCapacity: evenData.seatingCapacity,
            comments: {}
        }
        const insertInfo = await eventCollection.insertOne(event);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw `Could not add event`;
        }
        event._id = insertInfo.insertedId.toString();
        event = Object.assign({_id: event._id}, event);
        return event;
    },

    async getAll(projection) {
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

    async get(id) {
        id = await validation.checkEventId(id);
        const eventCollection = await events();
        const getEvent = await eventCollection.findOne({_id: new ObjectId(id)});
        if (getEvent === null) {
            throw `No event with that id`;
        }
        getEvent._id = getEvent._id.toString();
        return getEvent;
    },

    async remove(id) {
        id = await validation.checkEventId(id);
        const eventCollection = await events();
        const removeEvent = await eventCollection.deleteOne({_id: new ObjectId(id)});
        if (removeEvent.deletedCount === 0) {
            throw `Could not delete band with id of ${id}`;
        }
        return {bandId: id, deleted: removeEvent.deletedCount !== 0};
    },

    async update(
        id,
        eventName,
        description,
        date,
        time,
        location,
        organizer,
        seatingCapacity,
    ) {
        id = await validation.checkEventId(id);
        let evenData = await validation.checkEventConditions(
            eventName,
            description,
            date,
            time,
            location,
            organizer,
            seatingCapacity,
        );
        const eventCollection = await events();
        const originalData = await eventCollection.findOne({_id: new ObjectId(id)});
        const eventUpdate = {
            ...originalData, ...evenData,
            attendees: originalData.attendees, comments: originalData.comments
        };
        let updateInfo = await eventCollection.replaceOne(
            {_id: new ObjectId(id)},
            eventUpdate,
            {returnDocument: "after"}
        );

        if (updateInfo.matchedCount === 0) {
            throw `Error: Update failed`;
        }
        return await eventCollection.findOne({_id: new ObjectId(id)});
    }
}

export default exportedMethods;