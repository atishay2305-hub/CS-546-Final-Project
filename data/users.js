import {users, events} from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs'
import validation from '../validationchecker.js';
import {ObjectId} from "mongodb";

const authenticationCode = "Get privilege";
let exportedMethods = {
    /**
     *
     * @param firstName
     * @param lastName
     * @param email
     * @param userName
     * @param password
     * @param DOB
     * @param isAdmin
     * @param authentication
     * @returns {Promise<{createUser: boolean, userID: string}>}
     */
    async createUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        DOB,
        dept,
        isAdmin = false,
        authentication = null
        
    ) {
        firstName = validation.checkLegitName(firstName, 'First name');
        lastName = validation.checkLegitName(lastName, 'Last name');
        userName = validation.checkName(userName, 'User Name');
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
        //DOB = validation.checkDOB(DOB);

        const userCollection = await users();
        const checkExist = await userCollection.findOne({email: email});
        if (checkExist) throw "Sign in to this account or enter an email address that isn't already in user.";
        let user;
        if (isAdmin) {
            if (!authentication || typeof authentication !== "string" || authentication !== authenticationCode) {
                throw "Invalid admin verification code.";
            }
            user = {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                password: await bcrypt.hash(password, 10),
                DOB: DOB,
                eventIDs: [],
                commentIDs: [],
                isAdmin: true
            };
        } else {
            user = {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                password: await bcrypt.hash(password, 10),
                DOB: DOB,
                postIDs: [],
                commentIDs: []
            };
        }
        const insertInfo = await userCollection.insertOne(user);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user.";

        return {createUser: true, userID: insertInfo.insertedId.toString()};

        // if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user.";
        // return {insertedUser: true};
    },

    /**
     *
     * @param email
     * @param password
     * @returns {Promise<{authenticatedUser: boolean, userID: string}>}
     */

    async checkUser(email, password) {
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
        const userCollection = await users();
        const checkExist = await userCollection.findOne({email: email});
        if (!checkExist) throw "You may have entered the wrong email address or password.";
        const checkPassword = await bcrypt.compare(
            password,
            checkExist.password
        );
        if (!checkPassword) throw "You may have entered the wrong email address or password."
        const sessionUser = {
            userId: checkExist._id.toString(),
            userName: checkExist.userName
        };
        return {authenticatedUser: true,sessionUser:sessionUser};
    },


    async updateUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        DOB,
    ) {
        firstName = validation.checkLegitName(firstName, 'First name');
        lastName = validation.checkLegitName(lastName, 'Last name');
        userName = validation.checkName(userName, 'User Name');
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
        DOB = validation.checkDOB(DOB);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw "You may have entered the wrong email address or password.";
        const checkPassword = await bcrypt.compare(
            password,
            user.password
        );
        if (checkPassword) throw "Cannot be the same password as the original";
        const hashPassword = await bcrypt.hash(password, 10);
        const updatedInfo = await userCollection.updateOne(
            {email: email},
            {
                $set: {
                    password: hashPassword,
                    firstName: firstName,
                    lastName: lastName,
                    userName: userName,
                    DOB: DOB
                },
            }
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) {
            throw `Error: could not update email ${email}`;
        }
        return {updatedUser: true, email: email};
    },

    async getPostList(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        return user.postIDs;
    },
    async getEventList(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        if (!user.isAdmin) throw `Error: ${email} is not an administrator`
        return user.eventIDs;
    },

    async getCommentList(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        return user.commentIDs;
    },

    async getUserByEmail(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        user._id = user._id.toString();
        return user;
    },

    async getUserByID(userId) {
        userId = validation.checkId(userId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        user._id = user._id.toString();
        return user;
    },

    async getUserByUserName(userName) {
        userName = validation.checkName(userName);
        const userCollection = await users();
        const user = await userCollection.findOne({userName: userName});
        if (!user) throw `Error: ${user} not found`; //check password as well
        user._id = user._id.toString();
        return user;
    },

    async putPost(userId, postId) {
        userId = validation.checkId(userId);
        postId = validation.checkId(postId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let postIdList = user.postIDs;
        postIdList.push(new ObjectId(postId));
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {postIDs: postIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put post with that ID ${userId}`;
        return true;
    },


    async removePost(userId, postId) {
        userId = validation.checkId(userId);
        postId = validation.checkId(postId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        
        let postIdList = user.postIDs.map(post => post.toString());
        console.log(postIdList);

        if (postIdList.includes(postId)) {
            postIdList = postIdList.filter(elem => elem !== postId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(userId)},
                {$set: {postIDs: postIdList.map(id=>new ObjectId(id))}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove post with that ID${userId}`;
            return true;
        } else {
            throw `Error: postId ${postId} not found in postIDs list for user ${userId}`;
        }
    },
    
    async putEvent(userId, eventId) {
        userId = validation.checkId(userId);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let eventIdList = user.eventIDs;
        eventIdList.push(eventId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {eventIDs: eventIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put event with that ID ${eventId}`;
        return true;
    },

    async removeEvent(userId, eventId) {
        userId = validation.checkId(userId);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `User with that ID${userId} not found`; //check password as well
        let eventIdList = user.eventIDs;
        if (eventIdList.includes(eventId)) {
            eventIdList = eventId.filter(elem => elem !== eventId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(userId)},
                {$set: {eventIDs: eventIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove event with that ID${userId}`;
            return true;
        } else {
            throw `Error: eventId ${eventId} not found in eventIDs list for user ${userId}`;
        }
    },

    async putAttendee(userId, eventId) {
        userId = validation.checkId(userId);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `User with that ID${userId} not found`; //check password as well
        const eventCollection = await events()
        const event = eventCollection.findOne({_id: new ObjectId(eventId)});
        if (!event) throw `Event with that ID${eventId} not found`;
        const {attendees, seatingCapacity} = event;
        if (attendees.length >= seatingCapacity) {
            throw "Sorry, the event is already fully booked";
        }
        const attendeeName = `${user.firstName} ${user.lastName}`;
        attendees.push({id: userId, name: attendeeName});
        const updateInfo = await eventCollection.updateOne(
            {_id: new ObjectId(eventId)},
            {$set: {attendees}}
        )

        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
            throw `Could not update event with attendee`;
        }

        return `Successfully added ${attendeeName} as an attendee to the event.`

    },

    async removeAttendee(userId, eventId){
        userId = validation.checkId(userId);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `User with that ID${userId} not found`; //check password as well
        const eventCollection = await events()
        const event = eventCollection.findOne({_id: new ObjectId(eventId)});
        if (!event) throw `Event with that ID${eventId} not found`;
        const updatedList = event.attendees.filter(attendee=> attendee.id !== userId);
        if(updatedList.length === event.attendees.length) throw `User with ID ${userId} is not attending event with ID ${eventId}`;
        const updateInfo = await eventCollection.updateOne(
            {_id: new ObjectId(eventId)},
            {$set: {attendees: updatedList}}
        )
        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) throw `Could not update event with ID ${eventId}`;

        return `Successfully removed ${user.firstName} ${user.lastName} from the event with ID ${eventId}`;
    },

    async putComment(userId, commentId) {
        userId = validation.checkId(userId);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let commentIdList = user.commentIDs;
        commentIdList.push(commentId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {commentIDs: commentIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put comment with that ID ${userId}`;
        return true;
    },

    async removeComment(userId, commentId) {
        userId = validation.checkId(userId);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let commentIdList = user.commentIDs;
        if (commentIdList.includes(commentId)) {
            commentIdList = commentId.filter(elem => elem !== commentId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(userId)},
                {$set: {commentIDs: commentIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove post with that ID${userId}`;
            return true;
        } else {
            throw `Error: postId ${commentId} not found in commentIDs list for user ${userId}`;
        }
    },


    async removeUserById(userId) {
        userId = validation.checkId(userId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${userId} not found`; //check password as well
        const deletionInfo = await userCollection.deleteOne({_id: new ObjectId(userId)});
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${userId}`;
        }
        return `The user ${user._id} has been successfully deleted!`;
    }
}

export default exportedMethods;

