import {discussion, posts, users} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import {discussData} from "./index.js";


let exportedMethods = {
    async createDiscussion(category, topic, discussion, userName, req) {
        category = validation.checkLegitName(category, "category");
        // postedContent = validation.checkPhrases(postedContent, "PostedContent");
        const userId = validation.checkId(userName);
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
          topic: topic,
          discussion: discussion,
          userId: userId,
          created_Date: validation.getDate(),
          commentIds: {}
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

    async getAllDiscussions() {
        const discussionCollection = await discussion();
        return await discussionCollection.find({}).sort({created_Date: -1}).toArray();
    },

    async getDiscussionByCategory(category){
        category = validation.checkLegitName(category);
        const discussionCollection = await discussion();
        return await discussionCollection.find({category: category}).toArray();
    },

    async getDiscussionById(id) {
        id = await validation.checkId(id);
        const discussionCollection = await posts();
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
        //console.log(user.postID);
        if (user.isAdmin === undefined || !user.isAdmin) {
            if(!user.postIDs.includes(id)){
                throw "Only administrators or the poster can delete the discussion.";
            } 
        }

        const removeDiscussion = await discussionCollection.deleteOne({_id: new ObjectId(id)});
        if (removeDiscussion.deletedCount === 0) {
            throw `Could not delete with id of ${id}`;
        }
        await userData.removePost(discuss.userId.toString(), id);
        return {
            eventId: id,
            deleted: true
        };

    }
    
};
//express session,handlebars
export default exportedMethods;


