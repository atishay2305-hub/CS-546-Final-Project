import {events, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {commentData, userData} from "./index.js";
import multer from "multer";
//import commentData  from "./commentBtn.js";

let exportedMethods = {
    async createEvent(
        eventName,
        description,
        date,
        buildingName,
        roomNumber,
        organizer,
        seatingCapacity,
        userId,
        image,
    ) {
        eventName = validation.checkName(eventName, "EventName");
        description = validation.checkPhrases(description, "Description");
        date = validation.checkDate(date);
        buildingName = validation.checkLocation(buildingName, "BuildingName");
        roomNumber = validation.checkCapacity(roomNumber);
        organizer = validation.checkName(organizer, "Organizer");
        seatingCapacity = validation.checkCapacity(seatingCapacity);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
            throw `The user does not exist with that Id &{id}`;
        }
        if(user.role === 'user'){
            throw "You are unable to create event";
        }

        let event = {
            eventName: eventName,
            description: description,
            date: date,
            buildingName: buildingName,
            roomNumber: roomNumber,
            organizer: organizer,
            attendees: {},
            seatingCapacity: seatingCapacity,
            image: image,
            commentIds: [],
            userId: userId
        }

        const eventCollection = await events();
        const insertInfo = await eventCollection.insertOne(event);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add event";

        insertInfo._id = insertInfo.insertedId.toString();
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
        const event =await eventCollection.findOne({_id: new ObjectId(id)});
        if (event === null) throw "No event with that id";
        //const userCollection = await users();

        // const user = await userCollectio});
        // console.log(user);
        // if(!user){
        //     throw "user does not exists";
        // }
        // if (user.isAdmin === undefined || !user.isAdmin) throw "Only administrators can delete events.";
        const removeEvent = await eventCollection.deleteOne({_id: new ObjectId(id)});
        if (removeEvent.deletedCount === 0) {
            throw `Could not delete event with id of ${id}`;
        }
        //await commentData.removeCommentByEvent(id);
        //await commentData.removeCommentByEvent(id);
         //await commentData.removeCommentByEvent(id);
        return {
            eventId: id,
            deleted: true
        };
    },

    async searchEvent(searchTerm) {
        const eventCollection = await events();
        const searchRegex = new RegExp(searchTerm, 'i');
        const allEvents = await eventCollection.find({ eventName: searchRegex }).toArray();
        return allEvents;
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
        const eventCollection = await events();
        const checkEventExist = await eventCollection.findOne({_id: new ObjectId(id)});
        if (!checkEventExist) throw `Event is not exist with that ${id}`;
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)})
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
        let event = await eventCollection.updateOne({_id: new ObjectId(id)}, {$set: evenData});
        if (!event.acknowledged || event.matchedCount !== 1) {
            throw "Could not update record with that ID.";
        }
        return await eventCollection.findOne({_id: new ObjectId(id)});
    },

    async updateCapacity(
        id,
        seatingCapacity
    ) {
        id = validation.checkId(id);
        seatingCapacity = validation.checkCapacity(seatingCapacity, "SeatingCapacity");
        const eventCollection = await events();
        const checkEventExist = await eventCollection.findOne({_id: new ObjectId(id)});
        if (!checkEventExist) throw `Event is not exist with that ${id}`;
        let evenData = {
            seatingCapacity: seatingCapacity
        }
        let event = await eventCollection.updateOne({_id: new ObjectId(id)}, {$set: evenData});
        if (!event.acknowledged || event.matchedCount !== 1) {
            throw "Could not update record with that ID.";
        }
        return await this.getAllEvents();
    },

    async putComment(eventId, commentId) {
        eventId = validation.checkId(eventId);
        commentId = validation.checkId(commentId);
        const eventCollection = await events();
        const event = await eventCollection.findOne({_id: new ObjectId(eventId)});
        if (!event) throw `Error: ${event} not found`;
        console.log(event) 
        let commentIdList = event.commentIds;
        commentIdList.push(new ObjectId(commentId));
        const updatedInfo = await eventCollection.updateOne(
            {_id: new ObjectId(eventId)},
            {$set: {commentIds: commentIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put comment with that ID ${eventId}`;
        return true;
        },

    async getAttendeeById(eventId){
        eventId = validation.checkId(eventId);
        const eventCollection = await events();
        const event = await eventCollection.findOne({_id: new ObjectId(eventId)});
        if (!event) throw `Error: ${event} not found`;
        return event.attendees;
    }



}

export default exportedMethods;