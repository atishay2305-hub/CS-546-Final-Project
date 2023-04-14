// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import { postData } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from "mongodb";  
//import validateFunc from "../helpers.js"
//import { validateFunc } from '../helpers.js';

const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const postList = await postData.getAllPost();
      return res.status(200).json(postList);
    } catch (e) {
      return res.status(500).json({error: e.message});
    }
  })
  .post(async (req, res) => {
    //code here for POST

    let postD = req.body;
    let {category,content} = postD;
  try{
    const postCreate = await postData.createPost(category,content);
    //console.log(bandCreate);
    return res.status(200).json(postCreate);
  }catch(e){
    console.log(e);
    return res.status(400).json({error:e.message});
  }
  });

router
  .route('/:id')
  .get(async (req, res) => {

    //code here for GET
    try{
      //validateFunc.checkId(req.params.id);
      if (!req.params.id||typeof req.params.id !=='string'||req.params.id.trim().length===0){
        throw new Error('Id must be a non empty string');
    }
    req.params.id = req.params.id.trim();
    if (!ObjectId.isValid(req.params.id)){
      throw new Error('Invalid object Id');
    }
    }catch(e){
      return res.status(400).json({error:e.message});
    }
    try{
      const post = await postData.getPostById(req.params.id);
      return res.status(200).json(post);
    }catch(e){
      return res.status(404).json({error:e.message});
    }
  })

  .delete(async (req, res) => {
    //code here for DELETE
    try{
        //validateFunc.checkId(req.params.id);
        if (!req.params.id||typeof req.params.id !=='string'||req.params.id.trim().length===0){
          throw new Error('Id must be a non empty string');
      }
      req.params.id = req.params.id.trim();
      if (!ObjectId.isValid(req.params.id)){
        throw new Error('Invalid object Id');
      }
    }catch(e){
      return res.status(400).json({error:e.message});
    }
    try{
      const deleRecord = await postData.removeById(req.params.id);
      return res.status(200).json(deleRecord);
    }catch(e){
      return res.status(404).json({error:e.message});
    }
  })
  .put(async (req, res) => {

    //code here for PUT
    let Updatepost = req.body;
    let {category,content,img} = Updatepost;
    try{
      //validateFunc.checkId(req.params.id);
      if (!req.params.id||typeof req.params.id !=='string'||req.params.id.trim().length===0){
        throw new Error('Id must be a non empty string');
    }
    req.params.id = req.params.id.trim();
    if (!ObjectId.isValid(req.params.id)){
      throw new Error('Invalid object Id');
    }
  }catch(e){
    return res.status(400).json({error:e.message});
  }

  try{
    const post = await postData.getPostById(req.params.id);
    
  //const band = await bandCollection.findOne({_id: new ObjectId(req.params.id)});
  /*if(band === null){  
    throw new Error('No band record found with that Id');
  }*/
  }catch(e){
    return res.status(404).json({error:e.message});
  }
    try{
      const postUpdate = await postData.update(req.params.id,category,content,img);
      return res.status(200).json(postUpdate);
    }catch(e){
      return res.status(400).json({error:e.message})
    }

  });

export default router;