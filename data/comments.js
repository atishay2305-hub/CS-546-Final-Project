import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";


let exportedMethods ={

    async createComment(postid,comment){
        const newComment ={
            _id:new ObjectId(),
            userid:"64321cb672bd393e9e0f9ef4",
            comment:comment,
            comment_created:new Date()
          }
        const postCollection = await posts();
        const post = await postCollection.findOne({_id:new ObjectId(postid)});
        
      if (post === null){
        throw new Error('No post record found with that Id');
      }
    
    //const bandOne =await bands();
    const postComment = await postCollection.updateOne({_id:new ObjectId(postid)},{$push:{comments:newComment}});
    
    console.log(postComment.modifiedCount);
    if (postComment.modifiedCount === 0){
      throw new Error("unable to add comments to the posts");
    }
    
    const postUpdate = await postCollection.findOne({_id:new ObjectId(postid)});
    if(!postUpdate){
        throw new Error('Not able to update after adding ratings');
      }
      
      postUpdate._id = new ObjectId(postUpdate._id).toString();
      postUpdate.comments.forEach(element => {
        element._id = new ObjectId(element._id).toString();
      });
     return postUpdate;
    },

    async getAllComment(postid){

        if(!postid){
            throw new Error('postid is not provided');
          }
          if (typeof postid !=='string'||postid.trim().length===0){
            throw new Error('postid must be a non empty string');
          }
          postid = postid.trim();
          if(!ObjectId.isValid(postid)){
            throw new Error('postid object Id');
          }
          
          //await bandInfo.get()
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(postid)});
        if(post === null){  
          throw new Error('No band record found with that Id');
        }
        post._id = new ObjectId(post._id).toString();
        post.comments.forEach((element)=>{
          element._id = new ObjectId(element._id).toString();
        });
      
        return post.comments;

    },

    async getByComment(id){

        if(!id){
            throw new Error('albumID is not provided');
          }
        
          if (typeof id !=='string'||id.trim().length===0){
            throw new Error('albumID must be a non empty string');
          }
        
          id = id.trim();
        
          if(!ObjectId.isValid(id)){
            throw new Error('Invalid object Id');
          }
    
          const postCollection = await posts();
          let postList = await postCollection.find({}).toArray();
          //console.log(bandList);
          postList = postList.map((post) => {
            post._id = new ObjectId(post._id).toString();
            post.comments.forEach((element)=>{
              element._id = new ObjectId(element._id).toString();
            });
            return post;
          });
        
          const res = postList.filter((p)=>{
            return p.comments.find((element)=>element._id===id);
          }).map((p)=>p.comments.find((ele)=>ele._id===id)).find((elem)=>elem._id===id);
        
          if(res === undefined){
            throw new Error('Album not found');
          }
          else{
            return res;
          }
    },

    async removeComment(id){

        if(!id){
            throw new Error('Comment is not provided');
          }
        
          if (typeof id !=='string'||id.trim().length===0){
            throw new Error('commentId must be a non empty string');
          }
        
          id = id.trim();
        
          if(!ObjectId.isValid(id)){
            throw new Error('Invalid object Id');
          }
        
          const postCollection = await posts();
          const post = await postCollection.findOne({'comments._id':new ObjectId(id)});
          if(!post){
            throw new Error('No post found!');
          }
          console.log(post);
          const comment = await postCollection.updateOne({_id:new ObjectId(post._id)},{$pull:{comments:{_id:new ObjectId(id)}}});
          if (comment.modifiedCount===0){
            throw new Error('could not update record with that ID');
          }
        
          const commentAfterRemove = await postCollection.findOne({_id:new ObjectId(post._id)});
            if(!commentAfterRemove){
              throw new Error('Not able to update after removing posts');
            }
            console.log(commentAfterRemove);
    
            commentAfterRemove._id = new ObjectId(commentAfterRemove._id).toString();
            commentAfterRemove.comments.forEach(element => {
              element._id = new ObjectId(element._id).toString();
            });
        
            /*let deletionResult = {
              movieId: commentAfterRemove._id ,
              deleted: true
            }*/
            
            return commentAfterRemove;
    }

};

export default exportedMethods;

