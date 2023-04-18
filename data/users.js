import {users} from '../config/mongoCollections.js';
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
        isAdmin = false,
        authentication = null
    ) {
        firstName = validation.checkLegitName(firstName, 'First name');
        lastName = validation.checkLegitName(lastName, 'Last name');
        userName = validation.checkName(userName, 'User Name');
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
        DOB = validation.checkDOB(DOB);

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
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add event.";

        return {createUser: true, userID: insertInfo.insertedId.toString()};

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
        return {authenticatedUser: true, userID: checkExist._id.toString()};
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
        const checkExist = await userCollection.findOne({email: email});
        if (!checkExist) throw "You may have entered the wrong email address or password.";
        const checkPassword = await bcrypt.compare(
            password,
            checkExist.password
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
    async getEventList(email){
        email = validation.checkEmail(email);
        const userCollection = await users();
        const admin = await userCollection.findOne({email: email});
        if (!admin) throw `Error: ${admin} not found`; //check password as well
        if(!admin.isAdmin) throw `Error: ${email} is not an administrator`
        return admin.eventIDs;
    },

    async getCommentList(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        return user.commentIDs;
    },

    async getUser(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        user._id = user._id.toString();
        return user;
    },

    async getUserByID(id) {
        id = validation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        user._id = user._id.toString();
        return user;
    },

    async putPost(id, postId) {
        id = validation.checkId(id);
        postId = validation.checkId(postId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let postIdList = user.postIDs;
        postIdList.push(postId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {postIDs: postIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put post with that ID ${id}`;
        return true;
    },


    async removePost(id, postId) {
        id = validation.checkId(id);
        postId = validation.checkId(postId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let postIdList = user.postIDs;
        if (postIdList.includes(postId)) {
            postIdList = postId.filter(elem => elem !== postId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {postIDs: postIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove post with that ID${id}`;
            return true;
        } else {
            throw `Error: postId ${postId} not found in postIDs list for user ${id}`;
        }
    },

    async putEvent(id, eventId) {
        id = validation.checkId(id);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let eventIdList = user.eventIDs;
        eventIdList.push(eventId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {eventIDs: eventIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put event with that ID ${id}`;
        return true;
    },

    async removeEvent(id, eventId) {
        id = validation.checkId(id);
        eventId = validation.checkId(eventId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let eventIdList = user.eventIDs;
        if (eventIdList.includes(eventId)) {
            eventIdList = eventId.filter(elem => elem !== eventId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {eventIDs: eventIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove event with that ID${id}`;
            return true;
        } else {
            throw `Error: eventId ${eventId} not found in eventIDs list for user ${id}`;
        }
    },

    async putComment(id, commentId) {
        id = validation.checkId(id);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let commentIdList = user.commentIDs;
        commentIdList.push(commentId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {commentIDs: commentIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put comment with that ID ${id}`;
        return true;
    },

    async removeComment(id, commentId) {
        id = validation.checkId(id);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let commentIdList = user.commentIDs;
        if (commentIdList.includes(commentId)) {
            commentIdList = commentId.filter(elem => elem !== commentId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {commentIDs: commentIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove post with that ID${id}`;
            return true;
        } else {
            throw `Error: postId ${commentId} not found in commentIDs list for user ${id}`;
        }
    },

    async removeUserById(id) {
        id = validation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        const deletionInfo = await userCollection.deleteOne({_id: new ObjectId(id)});
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
        return `The user ${user._id} has been successfully deleted!`;
    }
}

export default exportedMethods;