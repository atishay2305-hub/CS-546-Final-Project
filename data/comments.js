import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import moment from 'moment';

let exportedMethods ={

    async createComment(id,comment){
        const newComment ={
            _id:new ObjectId(),
            comment:comment,
            comment_created:moment().format('MM-DD-YYYYTHH:mm:ss.SSSZ')
          }
        const userCollection = await users();
        const user = await userCollection.findOne({_id:new ObjectId(id)});
        
      if (user === null){
        throw new Error('No post record found with that Id');
      }
    
    const userComment = await userCollection.updateOne({_id:new ObjectId(id)},{$push:{comments:newComment}});
    
    console.log(userComment.modifiedCount);
    if (userComment.modifiedCount === 0){
      throw new Error("unable to add comments to the user");
    }
    
    const userUpdate = await userCollection.findOne({_id:new ObjectId(id)});
    if(!userUpdate){
        throw new Error('Not able to update after adding ratings');
      }
      
      userUpdate._id = new ObjectId(userUpdate._id).toString();
      userUpdate.comments.forEach(element => {
        element._id = new ObjectId(element._id).toString();
      });
     return userUpdate;
    },

    async getAllComment(id){

        if(!id){
            throw new Error('UserId is not provided');
          }
          if (typeof id !=='string'||id.trim().length===0){
            throw new Error('UserId must be a non empty string');
          }
          id = id.trim();
          if(!ObjectId.isValid(id)){
            throw new Error('Not a valid ID');
          }
          
          //await bandInfo.get()
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if(user === null){  
          throw new Error('No user record found with that Id');
        }
        user._id = new ObjectId(user._id).toString();
        user.comments.forEach((element)=>{
          element._id = new ObjectId(element._id).toString();
        });
      
        return user.comments;

    },

    async getByComment(id){

        if(!id){
            throw new Error('userID is not provided');
          }
        
          if (typeof id !=='string'||id.trim().length===0){
            throw new Error('userID must be a non empty string');
          }
        
          id = id.trim();
        
          if(!ObjectId.isValid(id)){
            throw new Error('Invalid object Id');
          }
    
          const userCollection = await users();
          let userList = await userCollection.find({}).toArray();
          //console.log(bandList);
          userList = userList.map((user) => {
            user._id = new ObjectId(user._id).toString();
            user.comments.forEach((element)=>{
              element._id = new ObjectId(element._id).toString();
            });
            return user;
          });
        
          const res = userList.filter((p)=>{
            return p.comments.find((element)=>element._id===id);
          }).map((p)=>p.comments.find((ele)=>ele._id===id)).find((elem)=>elem._id===id);
        
          if(res === undefined){
            throw new Error('comment not found');
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
        
          const userCollection = await users();
          const user = await userCollection.findOne({'comments._id':new ObjectId(id)});
          if(!user){
            throw new Error('No User found!');
          }
          console.log(user);
          const comment = await userCollection.updateOne({_id:new ObjectId(user._id)},{$pull:{comments:{_id:new ObjectId(id)}}});
          if (comment.modifiedCount===0){
            throw new Error('could not update record with that ID');
          }
        
          const commentAfterRemove = await userCollection.findOne({_id:new ObjectId(user._id)});
            if(!commentAfterRemove){
              throw new Error('Not able to update after removing users');
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

