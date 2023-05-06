import {discussion, posts, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {userData } from "./index.js";


let exportedMethods = {

    async createDiscussion(category, description,userId) {

        category = validation.checkLegitName(category, "category");
        description = validation.checkPhrases(description, "Description");
        // const userId = validation.checkId(userId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
          throw `The user does not exist with that Id &{id}`;
        }
        if (user.isAdmin) {
          throw "Discussion can only be created by users."
        }
      
        let discuss = {
          category: category,
          description: description,
          userId: user._id,
          created_Date: validation.getDate(),
          replyId:[]
        };
        const discussionCollection = await discussion();
        let insertInfo = await discussionCollection.insertOne(discuss);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
          throw "Could not add discussion.";
        }
      
        insertInfo._id = insertInfo.insertedId.toString();
        insertInfo = Object.assign({_id: insertInfo._id}, insertInfo);
        return insertInfo;
    },

    async getAllDiscussions(dbQuery) {
        const discussionCollection = await discussion();
        return await discussionCollection.find(dbQuery).sort({created_Date: -1}).toArray();
    },

    async getDiscussionByCategory(category){
        category = validation.checkLegitName(category);
        const discussionCollection = await discussion();
        return await discussionCollection.find({category: category}).toArray();
    },

    async getDiscussionById(id) {
        id = await validation.checkId(id);
        const discussionCollection = await discussion();
        const discuss = await discussionCollection.findOne({_id: new ObjectId(id)});
        if (discuss === null) {
            throw `No discussion was found with that ID ${id}`;
        }
        discuss._id = new ObjectId(discuss._id).toString();
        return discuss;
    },

    async getDiscussionByUserId(userId) {
        id = await validation.checkId(userId);
        const discussionCollection = await discussion();
        const discuss = await discussionCollection.findOne({_id: new ObjectId(userId)});
        if (discuss === null) {
            throw `No discussion was found with that ID ${userId}`;
        }
        discuss._id = new ObjectId(discuss._id).toString();
        return discuss;
    },

    async removeById(id) {
        id = await validation.checkId(id);
        const discussionCollection = await discussion();
        const discuss = await discussionCollection.findOne({_id: new ObjectId(id)});
        if (discuss === null) {
            throw `No discussion was found with that Id ${id}`;
        }
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(discuss.userId)});
        if (user.isAdmin === undefined || !user.isAdmin) {
            if(!user.postIDs.includes(id)){
                throw "Only administrators or the poster can delete the discussion.";
            }
        }

        const removeDiscussion = await discussionCollection.deleteOne({_id: new ObjectId(id)});
        if (removeDiscussion.deletedCount === 0) {
            throw `Could not delete with id of ${id}`;
        }
        await userData.removePost(post.userId.toString(), id);
        return {
            eventId: id,
            deleted: true
        };

    },
    
    async searchDiscussion(searchTerm) {
        const discussionCollection = await discussion();
        const searchRegex = new RegExp(searchTerm, 'i');
        const allDiscussions = await discussionCollection.find({
          $or: [
            { category: searchRegex },
            { description: searchRegex }
          ]
        }).toArray();
        return allDiscussions;
      },

    async updateDiscussion(id,userId,message){
        
        id = await validation.checkId(id);
        userId = await validation.checkId(userId);
        message = await validation.checkComments(message);

        const userCollection = await users();
        const user = await userCollection.findOne({_id:new ObjectId(userId)});
        if(!user){
            console.log('No user found!!');
        }
        
        const discussCollection = await discussion();
        const discuss = await discussCollection.findOne({_id:new ObjectId(id)});
        if(!discuss){
            throw "No discussion found!!"
        }
        const reply ={
            _id:new ObjectId(),
            userId:user._id,
            message:message
        };
        //discussion.replyId.push(reply);
        const discussUpdate = await discussCollection.updateOne({_id:new ObjectId(id)},{$push:{replyId:reply}});
        if(discussUpdate.modifiedCount === 0){
            throw new Error("unable to add reply to discussion");
        }
          const discussAfterUpdate = await discussCollection.findOne({_id:new ObjectId(id)});

          if(!discussAfterUpdate){
            throw new Error('Not able to update after adding albums');
          }

        return discussAfterUpdate;

    }
};

export default exportedMethods;


