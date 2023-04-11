import {posts} from './mongoCollections.js';
import { ObjectId } from 'mongodb';
import { exportedMethods } from './posts.js';


const create = async (postId, userWhoCommented, content, date) => {
    if(!postId || !userWhoCommented || !content || !date ){
        throw "You must provide all valid inputs to add a comment."
    }

    if(typeof(postId) !== "string"){
        throw "PostId must be of type string."
    }

    postId = postId.trim()
    if(postId.length === 0){
        throw "Post ID cannot be empty string."
    }

    if(!ObjectId.isValid(postId)){
        throw "Invalid post ID format."
    }

    const postCollection = await posts()
    const single_post = await postCollection.findOne({_id: new ObjectId(postId)});
    if(!single_post){
        throw "No band is found with that id."
    }

    if(typeof(userWhoCommented) !== "string"){
        throw "User must be of type string."
    }

    if(userWhoCommented.trim().length === 0){
        throw "Content cannot be an empty string."
    }

    
    if(typeof(content) !== "string"){
        throw "Content should be of type string."
    }

    if(content.trim().length === 0){
        throw "Content cannot be an empty string."
    }

  if (typeof(date) !== "string") {
  throw "Date must be of type string."
    }

if (date.trim().length === 0) {
  throw "Date cannot be an empty string."
    }

const dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

date = date.trim();
if (!dateRegex.test(date)){
  throw "Invalid date format. Date must be in the format mm/dd/yyyy.";
    }
const dateTimeStamp = Date.parse(date);
if (isNaN(dateTimeStamp)) {
  throw "Invalid date string."
    }

    const comment = {
        _id: new ObjectId(),
        userWhoCommented: userWhoCommented.trim(),
        content: content.trim(),
        date: date
    }

    const result = await postCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: comment } }
      );
    
}

const getAll = async (postId) => {
    if(!postId){
        throw "You must provide postID to get all comments."
    }

    if(typeof(postId) !== "string"){
        throw "Post ID must be of type string."
    }

    postId = postId.trim()
    if(postId.length === 0){
        throw "The postID is empty."
    }

    if(!ObjectId.isValid(postId)){
        throw "Invalid post ID format."
    }

    const postCollection = await posts();
    const single_post = await postCollection.findOne({_id: new ObjectId(postId)});
    if(!single_post){
        throw [404, `No post is found with that ID.`]
    }

    const post = await postCollection.findOne({ _id: new ObjectId(postId)});
    const comments = post.comments.map((comment) => {
    comment._id = comment._id.toString();
    return comment;
});
return comments;
}

const get = async (commentId) => {
    if(!commentId){
        throw "You must provide commentID to retrieve all comments."
    }

    if(typeof(commentId) !== "string"){
        throw "Comment ID must be string."
    }

    commentId = commentId.trim()
    if(commentId.length == 0){
        throw "CommentID must not be empty."
    }

    if(!ObjectId.isValid(commentId)){
        throw "Invalid comment ID format."
    }

    let flagComment = false;
    let bands = await exportedMethods.getAll();
    for(let i in posts){
        let tempComments = posts[i]["comments"]
        for(j in tempComments){
            let tempId = JSON.stringify(tempComments[j]["_id"]);
            if(tempId.includes(commentId)){
                flagComment = true;
                return { ...tempComments[j], _id: tempComments[j]._id.toString()};
            }
        }
    }

    if(flagComment === false){
        throw "Comment does not exist."
    }
}

const remove = async(commentId) => {
    if(!commentId){
        throw "You must provide commentID to remove a comment."
    }

    if(typeof(commentId) !== "string"){
        throw "Comment ID must be of type string."
    }

    if(!ObjectId.isValid(commentId)){
        throw "Invalid comment ID format."
    }

    const postDb = await posts();
    const postData = await exportedMethods.getAll();

    let postID;
    let post;
    let flag = false;

    for(let i in postData){
        let tempComments = postData[i]["comments"]
        for(let j in tempComments){
            let tempId = JSON.stringify(tempComments[j]["_id"]);
            if(tempId.includes(commentId)){
                flag = true;
                postID = postData[i]._id;
                post = await postDb.findOne({_id: new ObjectId(postID)});
                tempComments.splice(j, 1);
                await postDb.updateOne({_id: post._id}, {$set: {comments: tempComments}});
                break;
            }
        }
    }
}

