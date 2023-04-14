import { posts} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import moment from 'moment';
//const moment = require('moment');

let exportedMethods={
    async createPost(category,content){
        content = content.trim();

    const newPost={
        category:category.trim(),
        content:content,
        img:"https://ibb.co/r7L9Vm9",
        user_id:'64321cb672bd393e9e0f9ef4',
        created_Date:moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        likes:0,
        dislikes:0,
        comments:[

        ]
    };

    const postCollection = await posts();
    const post = await postCollection.insertOne(newPost);
    if(!post.acknowledged||!post.insertedId){
        throw new Error('could not add posts');
    }
    console.log(post);
    //const postColle = await posts();
    //const postNew = await postColle.findOne({_id:new ObjectId(post._id)});
    /*if(postNew === null){
        throw new Error('unable to find post with the id');
    }*/
    let resID = new ObjectId(post.insertedId);
      resID = resID.toString();
      const postNew = await this.getPostById(resID);
      //console.log(band);
      return postNew;
    },
    async getAllPost(){
        const postCollection = await posts();
        let postList = await postCollection.find({}).toArray();
        if (!postList){
            throw new Error('could not find posts');
        }
        //postList = postList.map((post)=>post._id = new ObjectId(post._id).toString());
        postList = postList.map((post) => {
            post._id = new ObjectId(post._id).toString();
            return post;
          });
    
        return postList;    
    },
    async getPostById(id){

        if (!id||typeof id !=='string'||id.trim().length===0){
            throw new Error('Id must be a non empty string');
        }
        id = id.trim();
    
        if (!ObjectId.isValid(id)){
          throw new Error('Invalid object Id');
        }
      
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(id)});
    
        if(post === null){  
          throw new Error('No band record found with that Id');
        }
      
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async removeById(id){

        if (!id||typeof id !=='string'||id.trim().length===0){
            throw new Error('Id must be a non empty string');
        }
          id = id.trim();
          if (!ObjectId.isValid(id)){
            throw new Error('Invalid object Id');
        }
          const postCollection = await posts();
          const postBand = await postCollection.findOneAndDelete({_id: new ObjectId(id)});
          if (postBand.lastErrorObject.n === 0) {
            throw {statusCode:404, error:`Could not delete band with id of ${id}`};
          }
          let deletionResult = {
            postId: id,
            deleted: true
          }
        
          return deletionResult;
    
    },
    async update(id,category,content,img){

        id= id.trim();
        if(!ObjectId.isValid(id)){
            throw new Error('Invalid object Id');
        }
    
        const updatedPost ={
            category:category,
            content:content,
            img:img,
            created_Date:new Date()
        }
    
        const postCollection =await posts();
        const post = await postCollection.findOneAndUpdate({_id:new ObjectId(id)},{$set:updatedPost},{returnDocument: 'after'});
        if (post.lastErrorObject.n===0){
            throw new Error('could not update record with that ID');
          }
          post.value._id = post.value._id.toString();
          return post.value;
    }

};
//express session,handlebars
export default exportedMethods;


