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

    if(!ObjectId.isValid(posterId)) throw "PosterID is not a valid Object ID."
   title = title.trim()
   body = body.trim()
    posterId = posterId.trim()
},

async getAllPosts() {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if(!postList){
        throw "Could not get all posts."
    }
    return postList;

}
















}