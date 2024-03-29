import {users, events} from '../config/mongoCollections.js';
import bcrypt from 'bcrypt'
import validation from '../validationchecker.js';
import {ObjectId} from "mongodb";
import {userData} from "./index.js";


let exportedMethods = {
    /**
     *
     * @param firstName
     * @param lastName
     * @param email
     * @param userName
     * @param password
     * @param DOB
     * @param department
     * @param role
     * @param authentication
     * @returns {Promise<{insertedUser: boolean, userID: string}>}
     */
    async createUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        DOB,
        role,
        department,
        authentication = null
    ) {
        firstName = validation.checkLegitName(firstName, 'First name');
        lastName = validation.checkLegitName(lastName, 'Last name');
        userName = validation.checkName(userName, 'User Name');
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
        DOB = validation.checkDOB(DOB);
        role = validation.checkRole(role);
        department = validation.checkDepartment(department);
        authentication = validation.checkAuth(authentication);
        const userCollection = await users();
        const checkExist = await userCollection.findOne({email: email});
        if (checkExist) throw "Sign in to this account or enter an email address that isn't already in user.";
        const checkUserNameExist = await userCollection.findOne({userName: userName});
        if (checkUserNameExist) throw "User name already exists.";
        let user = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: await bcrypt.hash(password, 10),
            DOB: DOB,
            commentIDs: [],
            eventAttend: [],
            discussion:[],
            role: role,
            department: department,
            authentication: false
        };

        if (role === 'admin' && authentication) {
            user.eventIDs = [];
            user.role = 'admin';
            user.authentication = true;
        }else{
            user.postIDs = [];
            user.role = 'user';
            user.authentication = authentication;

        }

        const insertInfo = await userCollection.insertOne(user);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user.";

        return {insertedUser: true, userID: insertInfo.insertedId.toString()};

    },

    /**
     *
     * @param email
     * @param password
     * @return {Promise<{firstName: (string|*), lastName: (string|*), emailAddress: *, role: *, userName: (string|*)}>}
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
        if (!checkPassword) throw "You may have entered the wrong email address or password.";
        const userId = checkExist._id.toString();
        return {
            firstName: checkExist.firstName,
            lastName: checkExist.lastName,
            userName: checkExist.userName,
            userId: userId,
            emailAddress: checkExist.email,
            role: checkExist.role,
            department: checkExist.department
        };
    },


    async updateUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        DOB,
        department,
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
                    DOB: DOB,
                    department: department,
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

    async checkPostEditable(userId, postId) {
        userId = validation.checkId(userId);
        postId = validation.checkId(postId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`;
        const postList = user.postIDs;
        return postList.includes(postId);
    },

    async checkEventEditable(userId, eventId) {
        userId = validation.checkId(userId);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`;
        const eventList = user.eventIDs;
        return eventList.includes(eventId);
    },

    async checkComment(userId, commentId) {
        userId = validation.checkId(userId);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`;
        const commentList = user.commentIDs;
        return commentList.includes(commentId);
    },

    async getEventList(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        if (!user.role !== 'admin') throw `Error: ${email} is not an administrator`
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
        if (!user) throw `Error: ${email} not found`; //check password as well
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
        postIdList.push(postId);
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
        let postIdList = user.postIDs;
        if (postIdList.includes(postId)) {
            postIdList = postIdList.filter(elem => elem !== postId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(userId)},
                {$set: {postIDs: postIdList}}
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

    async putDiscuss(userId, discussId) {
        userId = validation.checkId(userId);
        discussId = validation.checkId(discussId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let discussIdList = user.discussion;
        discussIdList.push(discussId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {discussion: discussIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put event with that ID ${discussId}`;
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
        const event = await eventCollection.findOne({_id: new ObjectId(eventId)});
        if (!event) throw `Event with that ID${eventId} not found`;
        const checkExist = Object.values(event.attendees).some(attendee => attendee.id === userId);
        if(checkExist){
            throw "The user already registered"
        }
        const {attendees, seatingCapacity} = event;
        const length = seatingCapacity - Object.keys(attendees).length
        if (length <= 0) {
            throw "Sorry, the event is already fully booked";
        }
        const attendeeName = `${user.firstName} ${user.lastName}`;
        attendees[seatingCapacity - length] = {id: userId, name: attendeeName};
        const updateInfo = await eventCollection.updateOne(
            {_id: new ObjectId(eventId)},
            {$set: {attendees}}
        )
        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
            throw `Could not update event with attendee`;
        }
        const eventAttend = user.eventAttend;
        eventAttend.push(eventId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {eventAttend: eventAttend}}
        )
        if (!updatedInfo.matchedCount || !updatedInfo.modifiedCount) {
            throw `Could not update attendee with event`;
        }

        return {updateInfo: true, eventId: eventId};
    },

    async removeAttendee(userId, eventId) {
        userId = validation.checkId(userId);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `User with ID ${userId} not found`;
        const eventCollection = await events();
        const event = await eventCollection.findOne({_id: new ObjectId(eventId)});
        if (!event) throw `Event with ID ${eventId} not found`;
        const updatedAttendees = {};
        let attendeeRemoved = false;
        for (const [attendeeId, attendeeData] of Object.entries(event.attendees)) {
            if (attendeeData.id !== userId ) {
                updatedAttendees[attendeeId] = attendeeData;
            } else {
                attendeeRemoved = true;
            }
        }
        if (!attendeeRemoved) {
            throw `User with ID ${userId} is not attending event with ID ${eventId}`;
        }
        const updateInfo = await eventCollection.updateOne(
            {_id: new ObjectId(eventId)},
            {$set: {attendees: updatedAttendees}}
        );
        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
            throw `Could not update event with ID ${eventId}`;
        }
        return {deleteInfo: true, eventId: eventId};
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

    async updatePassword(id, password){
        id = validation.checkId(id);
        password = validation.checkPassword(password);
        const  userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if(!user) throw `Error: user ${id} not found`;
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(user._id)},
            {$set: {password: await bcrypt.hash(password, 10)}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) {
            throw `Error: could not update password ${password}`;
        }
        return {updatedPassword: true};

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
    },

    async putEventAttended(userId, eventId){
        userId = validation.checkId(userId);
        eventId  = validation.checkId(eventId);
        const user = await userData.getUserByID(userId);
        if (!user) throw `Error: ${userId} not found`; //check password as well
        let eventAttended = user.eventAttended || []; // initialize to empty array
        const eventIndex = eventAttended.findIndex(event => event.eventId === eventId);
        if (eventIndex === -1) {
            // event not found in eventAttended array, add it
            eventAttended.push({eventId: eventId});
        }
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {eventAttended: eventAttended}}
        )
        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not update userId ${userID}`;
        }
        return  true;
    },


    async removeEventAttended(userId, eventId){
        userId = validation.checkId(userId);
        eventId  = validation.checkId(eventId);
        const user = await userData.getUserByID(userId);
        if (!user) throw `Error: ${userId} not found`; //check password as well
        let eventAttended = user.eventAttended.filter(event => event.eventId !== eventId);eventAttended.push({eventId: eventId});
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {eventAttended: eventAttended}}
        )
        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not update userId ${userId}`;
        }
        return  true;
    }
}

export default exportedMethods;
