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
        let userId = user._id;
        if (!user) {
            throw `The user does not exist with that Id &{id}`;
        }
        if(user.role === 'admin'){
            throw "You are unable to create post";
        }

        image = image.replace(/\\/g, '/');

        let post = {
            category: category,
            content: postedContent,
            image: image,
            userId: userId,
            userName: userName,
            address: address,
            created_Date: validation.getDate(),
            likedBy:[],
            dislikedBy:[],
            commentIds: []
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

    async getAllPosts() {
        const postCollection = await posts();
        return await postCollection.find({}).sort({created_Date: -1}).toArray();
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
        userId = await validation.checkId(userId);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(userId)});
        if (post === null) {
            throw `No post found with that userID ${userId}`;
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async getPostByUserIdTop(userId){
        const id = await validation.checkId(userId);
        const postCollection = await posts();
        const postList = await postCollection.find({userId:new ObjectId(userId)}).sort({created_Date: -1}).limit(5).toArray();

        return postList;

    },

    async removePostById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(id)});
        if (post === null) {
            throw `No post found with that Id ${id}`;
        }
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(post.userId.toString())});
        let postIdList = user.postIDs.map(post => post.toString());
        const removePost = await postCollection.deleteOne({_id: new ObjectId(id)});
        if (removePost.deletedCount === 0) {
            throw `Could not delete band with id of ${id}`;
        }
        await userData.removePost(post.userId.toString(), id);

        return {
            eventId: id,
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
            path = validation.createImage(image).replace(/\//g, "\\");
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

    async putComment(postId, commentId) {
        postId = validation.checkId(postId);
        commentId = validation.checkId(commentId);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(postId)});
        if (!post) throw `Error: ${post} not found`;
        let commentIdList = post.commentIds;
        commentIdList.push(new ObjectId(commentId));
        const updatedInfo = await postCollection.updateOne(
            {_id: new ObjectId(postId)},
            {$set: {commentIds: commentIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put comment with that ID ${postId}`;
        return true;
    },

    async updateDisLikes(postId, liked, disliked){
        postId = validation.checkId(postId);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(postId)});

        if(!post) `Error: ${post} not found`;
        if (!liked && !disliked) {
            if (post.dislikes > 0) {
                post.dislikes--;
            } else if (post.likes > 0) {
                post.likes--;
            }
        } else {
            if (disliked) {
                if (liked && post.likes > 0) {
                    post.likes--;
                }
                post.dislikes++;
            } else {
                post.dislikes--;
            }
        }


        const updatedInfo = await postCollection.updateOne(
            {_id: new ObjectId(postId)},
            { $set: { likes: post.likes, dislikes: post.dislikes}}
        );
        if (updatedInfo.modifiedCount === 0) {
            throw `Error: Failed to update likes and dislikes for post ${postId}`;
        }
        return {likes: post.likes, dislikes: post.dislikes};
    },

    async updateLikes(postId, userId,liked,disliked){
        postId = validation.checkId(postId);
        //userId =validation
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(postId)});
        if(!post) `Error: ${post} not found`;

        if (liked && !post.likedBy.includes(userId)) {
            // If the user has not already liked the post
            post.likedBy.push(userId);
            if (post.dislikedBy.includes(userId)) {
                // If the user has already disliked the post, remove their dislike
                post.dislikedBy = post.dislikedBy.filter((id) => id !== userId);
            }
            post.likes = post.likedBy.length;
            post.dislikes = post.dislikedBy.length;

        } else if (disliked && !post.dislikedBy.includes(userId)) {
            // If the user has not already disliked the post
            post.dislikedBy.push(userId);
            if (post.likedBy.includes(userId)) {
                // If the user has already liked the post, remove their like
                post.likedBy = post.likedBy.filter((id) => id !== userId);
            }
            post.likes = post.likedBy.length;
            post.dislikes = post.dislikedBy.length;
        }

        const updatedPost = await postCollection.updateOne({ _id: post._id }, { $set: post });
        return post;
    }

};

export default exportedMethods;

