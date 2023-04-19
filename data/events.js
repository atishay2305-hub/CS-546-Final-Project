import { events, users } from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import { userData } from "./index.js";

let exportedMethods = {
  async createEvent(
    eventName,
    description,
    buildingName,
    organizer,
    seatingCapacity,
    userId
  ) {
    if (!eventName) {
      throw "You must provide a name for the event.";
    }

    if (typeof eventName !== "string") {
      throw "The event name should be a string.";
    }

    if (eventName.trim().length === 0) {
      throw "Event name cannot be an empty string or just spaces.";
    }

    if (!description) {
      throw "You must provide a description for the event.";
    }

    if (typeof description !== "string") {
      throw "The description should be a string.";
    }

    if (description.trim().length === 0) {
      throw "Description cannot be an empty string or just spaces.";
    }

    if (!buildingName) {
      throw "You must provide a building name for the event.";
    }

    if (typeof buildingName !== "string") {
      throw "The building name should be a string.";
    }

    if (buildingName.trim().length === 0) {
      throw "Building name cannot be an empty string or just spaces.";
    }

    if (!organizer) {
      throw "You must provide an organizer for the event.";
    }

    if (typeof organizer !== "string") {
      throw "The organizer should be a string.";
    }

    if (organizer.trim().length === 0) {
      throw "Organizer cannot be an empty string or just spaces.";
    }

    if (!seatingCapacity) {
      throw "You must provide seating capacity for the event.";
    }

    if (typeof seatingCapacity !== "number") {
      throw "The seating capacity should be a number.";
    }

    if (seatingCapacity <= 0) {
      throw "The seating capacity must be a positive number.";
    }
    // TODO: IMAGE HANDLING
    // let path = "";
    // if (!image || image.trim().length === 0) {
    //   path = "public/images/default.png";
    // } else {
    //   // Assume validation.createImage is a function that validates and stores the image
    //   path = validation.createImage(image);
    // }

    let event = {
      eventName: eventName,
      description: description,
      date: validation.getDate(),
      buildingName: buildingName,
      organizer: organizer,
      attendees: {},
      seatingCapacity: seatingCapacity,
      comments: {},
      userId: userId,
      //   image: path,
    };

    const eventCollection = await events();
    const insertInfo = await eventCollection.insertOne(event);
    const insertedId = insertInfo.insertedId;

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw `Could not add event`;
    }

    const insertedEvent = await eventCollection.findOne({ _id: insertedId });
    const finalEvent = {
      _id: insertedEvent._id.toString(),
      eventName: insertedEvent.eventName,
      description: insertedEvent.description,
      date: insertedEvent.date,
      buildingName: insertedEvent.buildingName,
      organizer: insertedEvent.organizer,
      attendees: insertedEvent.attendees,
      seatingCapacity: insertedEvent.seatingCapacity,
      comments: insertedEvent.comments,
      userId: insertInfo.userId,
      //   image: insertedEvent.image,
    };
    return finalEvent;
  },

  //   async removeImage(image) {
  //     try {
  //       await fs.promises.unlink(image);
  //       console.log(`Image ${image} successfully removed from file system.`);
  //     } catch (e) {
  //       console.error(`Error removing image ${image} from file system: ${e}`);
  //     }
  //   },

  async getAllEvents() {
    const eventCollection = await events();
    const eventsList = await eventCollection.find({}).toArray();
    if (eventsList.length === 0) {
      throw "Unable to retrieve all events.";
    }
    return eventsList.map((event) => ({
      _id: event._id.toString(),
      eventName: event.eventName,
      description: event.description,
      date: event.date,
      buildingName: event.buildingName,
      organizer: event.organizer,
      attendees: event.attendees,
      seatingCapacity: event.seatingCapacity,
      comments: event.comments,
      userId: event.userId,
      // image: event.image
    }));
  },
  async getEventByID(id) {
    // id = await validation.checkId(id);
    if (!id) {
      throw "You must providde an id to search the event for.";
    }
    if (typeof id !== "string") {
      throw "ID must be a string.";
    }

    if (id.trim().length === 0) {
      throw "ID cannot be an empty string or just spaces.";
    }

    id = id.trim();

    if (!ObjectId.isValid(id)) {
      throw "Invalid object ID.";
    }
    const eventCollection = await events();
    const event = await eventCollection.findOne({ _id: new ObjectId(id) });
    if (event === null) {
      throw `No event with that id`;
    }
    event._id = new ObjectId(event._id).toString();
    return event;
  },

  async removeEventById(id) {
    if (!id) {
      throw "You must provide an id to search for.";
    }

    if (typeof id !== "string") {
      throw "Id must be a string.";
    }

    if (id.trim().length === 0) {
      throw "ID cannot be an empty string or just spaces.";
    }

    id = id.trim();

    if (!ObjectId.isValid(id)) {
      throw "Invalid object ID.";
    }

    const eventCollection = await events();
    const removeEvent = await eventCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (removeEvent.deletedCount === 0) {
      throw `Could not delete event with id of ${id}`;
    }

    return `${removeEvent.value} has been deleted.`;
  },

  async updateEvent(id, eventName, description, buildingName, organizer, seatingCapacity) {
    if (!eventName) {
      throw "You must provide a name for the event.";
    }
    if (typeof eventName !== "string") {
      throw "The event name should be a string.";
    }
  
    if (eventName.trim().length === 0) {
      throw "Event name cannot be an empty string or just spaces.";
    }
  
    if (!description) {
      throw "You must provide a description for the event.";
    }
  
    if (typeof description !== "string") {
      throw "The description should be a string.";
    }
  
    if (description.trim().length === 0) {
      throw "Description cannot be an empty string or just spaces.";
    }
  
    if (!buildingName) {
      throw "You must provide a building name for the event.";
    }
  
    if (typeof buildingName !== "string") {
      throw "The building name should be a string.";
    }
  
    if (buildingName.trim().length === 0) {
      throw "Building name cannot be an empty string or just spaces.";
    }
  
    if (!organizer) {
      throw "You must provide an organizer for the event.";
    }
  
    if (typeof organizer !== "string") {
      throw "The organizer should be a string.";
    }
  
    if (organizer.trim().length === 0) {
      throw "Organizer cannot be an empty string or just spaces.";
    }
  
    if (seatingCapacity === undefined) {
      throw "You must provide seating capacity for the event.";
    }
  
    if (typeof seatingCapacity !== "number") {
      throw "The seating capacity should be a number.";
    }
  
    if (seatingCapacity < 0) {
      throw "The seating capacity cannot be negative.";
    }
  
    const userCollection = await users();
    const eventCollection = await events();
    const checkEventExist = await eventCollection.findOne({ _id: new ObjectId(id) });
    if (!checkEventExist) {
      throw `Event does not exist with ID ${id}.`;
    }
    // const checkAdmin = await userCollection.findOne({
    //   _id: new ObjectId(userId),
    // });
    // if (!checkAdmin.isAdmin) throw "You're ineligible to edit event";
    const eventData = {
      eventName: eventName.trim(),
      description: description.trim(),
      date: new Date(),
      buildingName: buildingName.trim(),
      organizer: organizer.trim(),
      seatingCapacity: seatingCapacity,
    };
  
    const updatedEvent = await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: eventData }
    );
    if (!updatedEvent.acknowledged || updatedEvent.matchedCount !== 1) {
      throw `Could not update record with ID ${id}.`;
    }
    return await eventCollection.findOne({ _id: new ObjectId(id) });
  }

  //   async getEventByAdmin(email) {
  //     email = validation.checkEmail(email);
  //     let eventIdsList = await userData.getEventList(email);
  //     return await Promise.all(
  //       eventIdsList.map(async (eventId) => {
  //         return await this.getEventByID(eventId);
  //       })
  //     );
  //   },
};

export default exportedMethods;
