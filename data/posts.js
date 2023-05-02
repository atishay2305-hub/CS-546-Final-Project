import {posts, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {userData} from "./index.js";
import multer from "multer";
import path from "path";


let exportedMethods = {
    async createPost(category, image, postedContent, userName, req) {
        category = validation.checkLegitName(category, "category");
        // postedContent = validation.checkPhrases(postedContent, "PostedContent");
        const userId = validation.checkId(userName);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
          throw `The user does not exist with that Id &{id}`;
        }
        if (user.isAdmin) {
          throw "Post can only be created by users."
        }
      
        let imagePath = '';
        if (req.file) {
          imagePath = req.file.path.replace('public', '');
        } else {
          imagePath = 'images/default.jpg';
        }
      
        if(!req){
            throw "Error"
        }
        let post = {
          category: category,
          content: postedContent,
          image: imagePath,
          userId: user._id,
          created_Date: validation.getDate(),
          likes: 0,
          dislikes: 0,
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
        id = await validation.checkId(userId);
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
        const user = await userCollection.findOne({_id: new ObjectId(post.userId.toString())});
        // console.log(user);
        // console.log("hello macha!!",user.postIDs);
        let postIdList = user.postIDs.map(post => post.toString());
        // console.log(postIdList);
        // if (user.isAdmin === undefined || !user.isAdmin){
        //     if(!postIdList.includes(id)){
        //         throw "Only administrators or the poster can delete posts.";
        //     }
        // }
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
      
      async putComment(postId, commentId) {
        postId = validation.checkId(postId);
        commentId = validation.checkId(commentId);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(postId)});
        if (!post) throw `Error: ${post} not found`;
        // console.log(post) 
        let commentIdList = post.commentIds;
        commentIdList.push(new ObjectId(commentId));
        const updatedInfo = await postCollection.updateOne(
            {_id: new ObjectId(postId)},
            {$set: {commentIds: commentIdList}}
        );
        if (!updatedInfo.acknowledged || updatedInfo.matchedCount !== 1) throw `Could not put comment with that ID ${postId}`;
        return true;
        }

};
//express session,handlebars
export default exportedMethods;


