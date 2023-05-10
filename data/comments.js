import {comments, events, posts, users} from "../config/mongoCollections.js";
import {userData} from "./index.js";
import validation from '../validationchecker.js';
import {ObjectId} from "mongodb";


let exportedMethods = {
    async createComment(userId, eventId, postId, contents, commentType) {
        userId = validation.checkId(userId);
        contents = validation.checkComments(contents);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
            throw "No user found!";
        }
        const comment = {
            _id: new ObjectId(),
            userId: user._id,
            userName: user.userName,
            contents,
            created_Date: validation.getDate(),
        };
        if (commentType === "post") {
            postId = validation.checkId(postId);
            const postCollection = await posts();
            const post = await postCollection.findOne({_id: new ObjectId(postId)});
            if (!post) {
                throw new Error("No Post found!!");
            }
            comment.postId = post._id;
        }
        if (commentType === "event") {
            eventId = validation.checkId(eventId);
            const eventCollection = await events();
            const event = await eventCollection.findOne({
                _id: new ObjectId(eventId),
            });
            if (!event) {
                throw new Error("No Event found!!");
            }
            comment.eventId = event._id;
        }
        // const comment = {
        //     _id: new ObjectId(),
        //     contents,
        //     userId:new ObjectId(userId),
        //     postId:post._id,
        //     created_Date: validation.getDate()
        // }
        // if(eventId){
        //     eventId = validation.checkId(eventId);
        //     comment.evenId = eventId;
        //     const eventCollection = await events();
        //     const updateEvent = await eventCollection.updateOne(
        //         {_id: eventId},
        //         {$push: {commentIds: comment._id.toString()}}
        //     );
        //     console.log(updateEvent);
        //     // if(!updateEvent.matchedCount || !updateEvent.modifiedCount){
        //     //     throw "Could not update event with commentId";
        //     // }
        // }
        // if(postId){
        //     postId = validation.checkId(postId);
        //     comment.postId = postId;
        //     const postCollection = await posts();
        //     const updateEvent = await postCollection.updateOne(
        //         {_id: postId},
        //         {$push: {commentIds: comment._id.toString()}}
        //     );
        //     // if(!updateEvent.matchedCount || !updateEvent.modifiedCount){
        //     //     throw "Could not update post with commentId";
        //     // }
        // }
        const commentCollection = await comments();
        const commentInfo = await commentCollection.insertOne(comment);
        if (!commentInfo.acknowledged || !commentInfo.insertedId) {
            throw "Could not add this comment";
        }
        return {commentId: commentInfo.insertedId.toString()};
    },

    async getAllComments(projection) {
        const commentCollection = await comments();
        return await commentCollection
            .find({})
            .sort({created_Date: -1})
            .toArray();
    },

    async getCommentById(commentId) {
        commentId = validation.checkId(commentId);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({
            _id: new ObjectId(commentId),
        });
        if (!comment) {
            throw `No comment with that id ${commentId}`;
        }
        const user = userData.getUserByUserName(comment.userName);
        return comment;
    },
    async removeCommentById(commentId) {
        commentId = validation.checkId(commentId);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({
            _id: new ObjectId(commentId),
        });
        if (!comment) {
            throw `No comment with that id ${commentId}`;
        }
        let userId = comment.userId.toString();
        if (comment.eventId) {
            const eventCollection = await events();
            const updateEvent = await eventCollection.updateOne(
                {_id: new ObjectId(comment.eventId)},
                {$pull: {commentIds: commentId}}
            );
            if (updateEvent.matchedCount === 0 && updateEvent.modifiedCount === 0) {
                throw `Could not remove comment with id ${commentId} from event with id ${comment.eventId}`;
            }
        } else if (comment.postId) {
            const postCollection = await posts();
            const updatePost = await postCollection.updateOne(
                {_id: new ObjectId(comment.postId)},
                {$pull: {commentIds: commentId}}
            );
            if (updatePost.matchedCount === 0 && updatePost.modifiedCount === 0) {
                throw `Could not remove comment with id ${commentId} from event with id ${comment.eventId}`;
            }
        }
        const deleteInfo = await commentCollection.deleteOne({
            _id: new ObjectId(commentId),
        });
        if (deleteInfo.deletedCount === 0) {
            throw `Could not delete comment with id with ${commentId}`;
        }

        return {deleteInfo: true};
    },

    async getEventCommentById(eventId) {
        eventId = await validation.checkId(eventId);
        // const post = await postData.getPostById(postId);
        // if(!post) throw `No  post with that id ${postId}`;
        const commentCollection = await comments();
        const userCollection = await users();
        console.log(eventId);
        const commentList = await commentCollection
            .find({eventId: new ObjectId(eventId)})
            .toArray();
        return commentList;

    },
    async getPostCommentById(postId) {
        postId = await validation.checkId(postId);
        const commentCollection = await comments();
        const userCollection = await users();
        return await commentCollection.find({postId: new ObjectId(postId)}).toArray();
    },


    async getPostHomeCommentById(postId) {

        postId = await validation.checkId(postId);

        const commentCollection = await comments();
        const commentList = await commentCollection.find({postId: new ObjectId(postId)}).toArray();
        const userCollection = await users();
        for (let x of commentList) {
            const user = await userCollection.findOne({_id: x.userId});
            x.userName = user.userName;
        }
    },

    // },

    async removeCommentByEvent(eventId) {
        eventId = await validation.checkId(eventId);
        const commentCollection = await comments();
        try {
            const commentCount = await commentCollection.countDocuments({ eventId: new ObjectId(eventId) });
            if(commentCount > 0){
                const commentList = await commentCollection.deleteMany({
                    postId: new ObjectId(eventId),
                });
                if (commentList.deletedCount === 0) {
                    throw "cannot delete comments for this event";
                }
            }else{
                return {empty: true};
            }
            return {deleted: true};
        } catch (e) {
            console.log(e);
        }
    },
    async removeCommentByPost(postId) {
        postId = await validation.checkId(postId);
        const commentCollection = await comments();
        try {
            const commentCount = await commentCollection.countDocuments({ postId: new ObjectId(postId) });
            if(commentCount > 0){
                const commentList = await commentCollection.deleteMany({
                    postId: new ObjectId(postId),
                });
                if (commentList.deletedCount === 0) {
                    throw "cannot delete comments for this post";
                }
            }else{
                return {empty: true};
            }
            return {deleted: true};
        } catch (e) {
            console.log(e);
        }
    },
    
};

export default exportedMethods;