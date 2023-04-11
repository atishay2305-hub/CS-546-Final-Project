import {posts} from './mongoCollections.js';
import { ObjectId } from 'mongodb';


const exportedMethods = {

async addPost (title, body, posterId){
    if(!title){
        throw "Title must be a string."
    }
    if(typeof title != 'string'){
        throw 'Title must be a string.'
    }

    if(title.trim().length == 0){
        throw "Title cannot be an emoty string or blank spaces."
    }

    if(!body){
        throw "You must provide a body."
    }

    if(typeof body != 'string'){
        throw "Body must be a string."
    }
    if(body.trim().length === 0){
        throw "PosterId cannot be an empty string or just spaces."
    }   

    if (!ObjectId.isValid(posterId)) throw "PosterID is not a valid Object ID.";
    title = title.trim();
    body = body.trim();
    posterId = posterId.trim();
    // comments is a sub document
    // refer albums.js lab6 for more details and code
    // initially comments will be an empty dictionary
    comments = []; 
},

async getAllPosts() {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if(!postList){
        throw "Could not get all posts."
    }
    return postList;
},


async getPostById(id) {
    if(!id){
        throw "You must provide an id for the post."
    }
    if(typeof id !== "You must provide an id to search for.")
    if(id.trim().length === 0){
        throw "ID cannot be empty string or just spaces."
    }
    id = id.trim()
    if(!ObjectId.isValid(id)){
        throw "Invalid object ID"
    }
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(id)});
    if(!post){
        throw "No post with that id is found."
    }

    return post;
},

async removePost(id){
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const postCollection = await posts();
    const deletionInfo = await postCollection.findOneAndDelete({
    _id: new ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0) {
        throw `Could not delete post with id of ${id}`;
      }
      return {deleted: true};
},

async updatePost(id, title, body, posterId){
    if (!id){
        throw "You must provide an id to search for."
    }
    if(typeof id !== 'string'){
        throw "ID must be of type string."
    }
    if(id.trim().length === 0){
        throw "ID cannot be an empty string or just spaces."
    }
    id = id.trim()
    if(!ObjectId.isValid(id)){
        throw "Invalid object ID."
    }
    if(!title){
        throw "You must provide a title."
    }
    if(typeof title !== 'string'){
        throw "Title must be a string."
    }
    if(title.trim().length === 0){
        throw "Title cannot be an empty string or just spaces."
    }
    if(!body){
        throw "You must provide a body."
    }
    if(typeof body !== "string"){
        throw "Body must be a string."
    }
    if (body.trim().length === 0){
        throw "Body cannpt be empty string or just spaces."
    }
    if (!ObjectId.isValid(posterId)) throw 'posterId is not a valid Object ID';
    title = title.trim();
    body = body.trim();
    posterId = posterId.trim();
}
}

export {exportedMethods}