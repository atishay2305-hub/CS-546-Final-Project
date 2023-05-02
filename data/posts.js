import {posts, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {userData} from "./index.js";
import multer from "multer";
import path from "path";


let exportedMethods = {
    async createPost(category, image, postedContent, userName, address) {
        category = validation.checkCategory(category, "category");
        postedContent = validation.checkPhrases(postedContent);
        // postedContent = validation.checkPhrases(postedContent, "PostedContent");
        userName = validation.checkName(userName);
        const userCollection = await users();
        const user = await userCollection.findOne({userName: userName});
        let userId = user._id. toString();
        if (!user) {
            throw `The user does not exist with that Id &{id}`;
        }
        if(user.role === 'admin'){
            throw "You are unable to create post";
        }


        let post = {
            category: category,
            content: postedContent,
            image: image,
            userId: userId,
            address: address,
            created_Date: validation.getDate(),
            likes: 0,
            dislikes: 0,
            commentIds: {}
        };
        const postCollection = await posts();
        let insertInfo = await postCollection.insertOne(post);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw "Could not add post";
        }

        insertInfo._id = insertInfo.insertedId.toString();
        insertInfo = Object.assign({_id: insertInfo._id}, insertInfo);
        return insertInfo;
    },

    async getAllPosts(projection) {
        const postCollection = await posts();
        let postList = undefined;
        if(!projection){
            return postList = await postCollection.find({}).sort({created_Date: -1}).toArray()
        }else{
            return postList = await postCollection.find({}).project(projection).sort({created_Date: -1}).toArray()
        }
    },

    async getPostByCategory(category){
        category = validation.checkLegitName(category);
        const postCollection = await posts();
        return await postCollection.find({category: category}).toArray();
    },

    async getPostById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(id)});
        if (post === null) {
            throw `No post found with that ID ${id}`;
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async getPostByUserId(userId) {
        let id = await validation.checkId(userId);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(userId)});
        if (post === null) {
            throw `No post found with that ID ${userId}`;
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async removeById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(id)});
        if (post === null) {
            throw `No post found with that Id ${id}`;
        }
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(post.userId)});
        //console.log(user.postID);
        if (user.isAdmin === undefined || !user.isAdmin) {
            if(!user.postIDs.includes(id)){
                throw "Only administrators or the poster can delete posts.";
            }
        }

        const removeDiscuss = await postCollection.deleteOne({_id: new ObjectId(id)});
        if (removePost.deletedCount === 0) {
            throw `Could not delete post with id of ${id}`;
        }
        await userData.removeDiscuss(discuss.userId.toString(), id);
        return {
            discussionId: id,
            deleted: true
        };

    },

    async updatePost(id,
                     userId,
                     category,
                     postedContent) {
        id = validation.checkId(id);
        userId = validation.checkId(userId);
        category = validation.checkLegitName(category, "category");
        postedContent = validation.checkPhrases(postedContent, "PostedContent");
        let path = "";
        if (!image || image.trim().length === 0) {
            path = "public/images/default.png";
        } else {
            path = validation.createImage(image);
        }
        const userCollection = await users();
        const checkPostExist = userCollection.findOne({_id: new ObjectId(id)});
        if (!checkPostExist) throw `Post is not exist with that ${id}`;
        const user = await userCollection.findOne({_id: new ObjectId(userId)})
        if (user.isAdmin === undefined || !user.isAdmin || !user.postIDs.includes(id)) {
            throw "Only administrators or the poster can delete posts.";
        }
        const updatedPost = {
            category: category,
            content: postedContent,
            created_Date: validation.getDate(),
            image: path
        }
        const postCollection = await posts();
        const post = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedPost});
        if (!post.acknowledged || post.matchedCount !== 1) {
            throw "Could not update post with that ID.";
        }
        return await postCollection.findOne({_id: new ObjectId(id)});
    },

    async getPostByEmail(email) {
        email = validation.checkEmail(email);
        let postIdList = await userData.getPostList(email);
        return await Promise.all(
            postIdList.map(async (eventId) => {
                return await this.getEventByID(eventId);
            })
        );
    },

    async increaseLikes(postId) {
        const post = await this.getPostById(postId);
        post.likes++;
        await this.updatePost(post._id, post.userId, post.category, post.content, post.likes, post.dislikes, post.commentIds);
        return post;
    },

    async increaseDislikes(postId) {
        const post = await this.getPostById(postId);
        post.dislikes++;
        await this.updatePost(post._id, post.userId, post.category, post.content, post.likes, post.dislikes, post.commentIds);
        return post;
    },

};
//express session,handlebars
export default exportedMethods;


