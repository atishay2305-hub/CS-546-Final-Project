import {users} from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs'
import validation from '../validationchecker.js';
import {ObjectId} from "mongodb";
import e from "express";

let exportedMethods = {
    /**
     *
     * @param firstName
     * @param lastName
     * @param username
     * @param password
     * @param email
     * @param DOB
     * @returns {Promise<{createUser: boolean, userID: string}>}
     */

    async createUser(
        firstName,
        lastName,
        username,
        password,
        email,
        DOB
    ) {
        firstName = validation.checkName(firstName, 'First name');
        lastName = validation.checkName(lastName, 'Last name');
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
        DOB = validation.checkDOB(DOB);

        const userCollection = await users();
        const checkExisted = await this.checkUser(email, password);
        if (checkExisted.authenticatedUser) throw "Sign in to this account or enter an email address that isn't already in user.";
        const hashPassword = await bcrypt.hash(password, 6);

        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            DOB: DOB,
            post_ids: [],
            comment_ids: []
        };
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
        if (checkExist) throw "Sign in to this account or enter an email address that isn't already in user.";
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
        email,
        password,
        DOB,
    ) {
        firstName = validation.checkName(firstName, 'First name');
        lastName = validation.checkName(lastName, 'Last name');
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
        const hashPassword = await bcrypt.hash(password, 6);
        const updatedInfo = await userCollection.updateOne(
            {email: email},
            {
                $set: {
                    password: hashPassword,
                    firstName: firstName,
                    lastName: lastName,
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
        return user.post_ids;
    },

    async getCommentList(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw `Error: ${user} not found`; //check password as well
        return user.comments_ids;
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
        let postIdList = user.post_ids;
        postIdList.push(postId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {post_ids: postIdList}}
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
        let postIdList = user.post_ids;
        if (postIdList.includes(postId)) {
            postIdList = postId.filter(elem => elem !== postId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {post_ids: postIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove post with that ID${id}`;
            return true;
        }else{
            throw `Error: postId ${postId} not found in post_ids list for user ${id}`;
        }
    },

    async putComment(id, commentId){
        id = validation.checkId(id);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let commentIdList = user.comment_ids;
        commentIdList.push(commentId);
        const updatedInfo = await userCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {comment_ids: commentIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put comment with that ID ${id}`;
        return true;
    },

    async removeComment(id, commentId){
        id = validation.checkId(id);
        commentId = validation.checkId(commentId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw `Error: ${user} not found`; //check password as well
        let commentIdList = user.comment_ids;
        if (commentIdList.includes(commentId)) {
            commentIdList = commentId.filter(elem => elem !== commentId);
            const updatedInfo = await userCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {post_ids: commentIdList}}
            );
            if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Error:could not remove post with that ID${id}`;
            return true;
        }else{
            throw `Error: postId ${commentId} not found in comment_ids list for user ${id}`;
        }
    },

    async removeUserById (id) {
        id = validation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(id) });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
        return `The user ${user._id} has been successfully deleted!`;
    }
}

export default exportedMethods;

