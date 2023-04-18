import {posts} from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import {ObjectId} from "mongodb";
import moment from 'moment';
//const moment = require('moment');

let exportedMethods = {
    async createPost(category,
                     postedContent,
    ) {
        category = validation.checkString(category, "category");
        postedContent = validation.checkString(postedContent, "PostedContent");
        let post = {
            category: category,
            content: postedContent,
            img: "https://ibb.co/r7L9Vm9",
            user_id: '64321cb672bd393e9e0f9ef4',
            created_Date: moment().format('MM-DD-YYYYTHH:mm:ss.SSSZ'),
            likes: 0,
            dislikes: 0,
            comments: {}
        };

        const postCollection = await posts();
        const insertInfo = await postCollection.insertOne(post);
        if (!post.acknowledged || !post.insertedId) {
            throw `Could not add post`;
        }
        post._id = insertInfo.insertedId.toString();
        post = Object.assign({_id: post._id}, post);
        //console.log(band);
        return post;
    },

    async getAllPost(projection) {
        const postCollection = await posts();
        let postList = undefined;
        if (!projection) {
            postList = await postCollection.find({}).toArray();
        } else {
            postList = await postCollection.find({}).project(projection).toArray();
        }
        if (!postList) {
            throw new Error('could not find posts');
        }
        //postList = postList.map((post)=>post._id = new ObjectId(post._id).toString());
        postList = postList.map(element => {
            element._id = new ObjectId(element._id).toString();
            return element;
        });

        return postList;
    },
    async getPostById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(id)});
        if (post === null) {
            throw new Error('No post found with that Id');
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async removeById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const postBand = await postCollection.findOneAndDelete({_id: new ObjectId(id)});
        if (postBand.lastErrorObject.n === 0) {
            throw {statusCode: 404, error: `Could not delete band with id of ${id}`};
        }
        return {
            postId: id,
            deleted: true
        };

    },
    async update(id, category, postedContent, img) {
        id = validation.checkId(id);
        category = validation.checkString(category, "category");
        postedContent = validation.checkString(postedContent, "PostedContent");
        const updatedPost = {
            category: category,
            content: postedContent,
            img: img,
            created_Date: new Date()
        }

        const postCollection = await posts();
        const post = await postCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: updatedPost}, {returnDocument: 'after'});
        if (post.lastErrorObject.n === 0) {
            throw new Error('could not update record with that ID');
        }
        post.value._id = post.value._id.toString();
        return post.value;
    }

};
//express session,handlebars
export default exportedMethods;


