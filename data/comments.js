import {events, posts, users, comments} from "../config/mongoCollections.js";
import {userData, eventsData, commentData} from "./index.js";
import {userData,commentData, postData} from "./index.js";
import validation from '../validationchecker.js';
import { ObjectId } from "mongodb";
import e from "express";


let exportedMethods ={

    async createComment(userId,
                        eventId = null,
                        postId = null,
                        userName,
                        contents){
        userId = validation.checkId(userId);
        contents = validation.checkPhrases(contents);

        const comment = {
            _id: new ObjectId(),
            userName,
            contents,
            created_Date: validation.getDate()
        }
        if(eventId){
            eventId = validation.checkId(eventId);
            comment.evenId = eventId;
            const eventCollection = await events();
            const updateEvent = await eventCollection.updateOne(
                {_id: eventId},
                {$push: {commentIds: comment._id.toString()}}
            );
            if(!updateEvent.matchedCount || !updateEvent.modifiedCount){
                throw "Could not update event with commentId";
            }
        }
        if(postId){
            postId = validation.checkId(postId);
            comment.postId = postId;
            const postCollection = posts();
            const updateEvent = await postCollection.updateOne(
                {_id: postId},
                {$push: {commentIds: comment._id.toString()}}
            );
            if(!updateEvent.matchedCount || !updateEvent.modifiedCount){
                throw "Could not update post with commentId";
            }
        }
        const commentCollection = await comments();
        const commentInfo = await commentCollection.insertOne(comment);
        if (!commentInfo.acknowledged || !commentInfo.insertedId) {
            throw "Could not add this comment";
        }

        const insertToUser = await userData.putComment(userId, comment._id.toString());
        if(!insertToUser){
            throw "Cannot insert commentID to user";
        }
        return {commentId: commentInfo.insertedId.toString()};
    },

    async getAllComments(projection) {
        const commentCollection = await comments();
        return await commentCollection.find({}).sort({created_Date: -1}).toArray();
    },

    async getCommentById(commentId){
        commentId = validation.checkId(commentId);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: new ObjectId(commentId)});
        if(!comment){
            throw `No comment with that id ${commentId}`;
        }
        const user = userData.getUserByUserName(comment.userName);

    },

    async removeCommentById(commentId){
        commentId = validation.checkId(commentId);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: new ObjectId(commentId)});
        if(!comment){
            throw `No comment with that id ${commentId}`;
        }
        let userId = comment.userId.toString();
        if(comment.evenId){
            const eventCollection = await events();
            const updateEvent = await eventCollection.updateOne(
                {_id: new ObjectId(commentId.evenId)},
                {$pull: {commentIds: commentId}}
            );
            if(!updateEvent.matchedCount || !updateEvent.modifiedCount) {
                throw `Could not remove comment with id ${commentId} from event with id ${comment.eventId}`;
            }
        }else if(comment.postId){
            const postCollection = await posts();
            const updatePost = await postCollection.updateOne(
                {_id: new ObjectId(commentId.postId)},
                {$pull: {commentIds: commentId}}
            );
            if(!updatePost.matchedCount || !updatePost.modifiedCount) {
                throw `Could not remove comment with id ${commentId} from post with id ${comment.postId}`;
            }
        }
        const deleteInfo = await commentCollection.deleteOne({_id: new ObjectId(commentId)})
        if(deleteInfo.deletedCount === 0){
            throw `Could not delete comment with id with ${commentId}`;
        }

        const userComment = userData.removeComment(userId, commentId);
        if(!userComment){
            throw `Either userId or commentId were stored incorrectly`;
        }
        return `The comment ${commentId} delete successfully`;
    },

    async getUserCommentById(userId){
        userId = await validation.checkId(userId)
        const user = await userData.getUserByID(userId);
        if(!user) throw `No event with that id ${userId}`;
        const commentList = userId.commentIds;
        const comments = [];
        for(let i = 0; i < commentList.length; i++){
            const comment = await this.getCommentById(commentList[i]);
        }
        return comments;
    },

    async getEventCommentById(eventId){
        eventId = await validation.checkId(eventId)
        const event = await eventsData.getEventByID(eventId);
        if(!event) throw `No event with that id ${eventId}`;
        const commentList = eventId.commentIds;
        const comments = [];
        for(let i = 0; i < commentList.length; i++){
            const comment = await this.getCommentById(commentList[i]);
        }
        return comments;
    },

    async getPostCommentById(postId){
        postId = await validation.checkId(postId)
        const post = await postData.getPostById(postId);
        if(!post) throw `No  post with that id ${postId}`;
        const commentList = postId.commentIds;
        const comments = [];
        for(let i = 0; i < commentList.length; i++){
            const comment = await this.getCommentById(commentList[i]);
        }
        return comments;
    }

};

export default exportedMethods;