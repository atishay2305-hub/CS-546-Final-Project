import { commentData } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from "mongodb";  
const router = Router();

router
  .route('/:postId')
  .get(async (req, res) => {
    //code here for GET
    try{
      if (!req.params.postId||typeof req.params.postId !=='string'||req.params.postId.trim().length===0){
        throw new Error('Id must be a non empty string');
    }
    }catch(e){
      return res.status(400).json({error:e.message});
    }
    
  req.params.postId = req.params.postId.trim();
  try{
    if (!ObjectId.isValid(req.params.postId)){
      throw new Error('Invalid object Id');
    }
  }catch(e){
    return res.status(400).json({error:'Invalid object Id'});
  }
 
    try{
      const commentList = await commentData.getAllComment(req.params.postId);
      return res.render('comments/comments', {comments: commentList});
      
    }catch(e){
      return res.status(404).json({error:e.message});
    }

  })
  .post(async (req, res) => {
    //code here for POST

    let createcmt = req.body;
    let{comment} = createcmt;
    if(typeof req.params.postId !=='string'||req.params.postId.trim().length===0){
        throw new Error('PostId must be a non empty string');
    }

    req.params.postId =req.params.postId.trim();
    
    if(!ObjectId.isValid(req.params.postId)){
        throw new Error('Invalid object Id');
    }

    try{
      const {userId,eventId,postId,userName,contents}=req.body; 
      const comments = await commentData.createComment(userId,eventId,postId,userName,contents);
     
        res.redirect(`/comments/comment/${comment._id}`);
    }catch(e){
        return res.status(400).json({error:e.message});
    }

});

router
  .route('/comment/:commentId')
  .get(async (req, res) => {
    //code here for GET
    try{
      if (!req.params.commentId||typeof req.params.commentId !=='string'||req.params.commentId.trim().length===0){
        throw new Error('Id must be a non empty string');
    }
    }catch(e){
      return res.status(400).json({error:e.message});
    }
    
  req.params.commentId = req.params.commentId.trim();
  try{
    if (!ObjectId.isValid(req.params.commentId)){
      throw new Error('Invalid object Id');
    }
  }catch(e){
    return res.status(400).json({error:e.message});
  }
  try{
    const comment = await commentData.getByComment(req.params.commentId);
    res.render('comments/comment', {comment: comment});
  }catch(e){
    
    return res.status(404).json({error:e.message});
  }
  
  })
  .delete(async (req, res) => {
    //code here for DELETE
       try{
        //validateFunc.checkId(req.params.id);
        if (!req.params.commentId||typeof req.params.commentId !=='string'||req.params.commentId.trim().length===0){
          throw new Error('Id must be a non empty string');
      }
      req.params.commentId = req.params.commentId.trim();
      if (!ObjectId.isValid(req.params.commentId)){
        throw new Error('Invalid object Id');
      }
    }catch(e){
      return res.status(400).json({error:e.message});
    }
    try{
      const deleRecord = await commentData.removeCommentByEvent(req.params.eventId);
      if(!deleRecord){
        throw new Error('No post with the ID found');
      }
      return res.status(200).json(deleRecord);
    }catch(e){
      return res.status(404).json({error:e.message});
    }
  
  });

export default router
