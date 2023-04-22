// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
/*import { postData } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from "mongodb";  
//import validateFunc from "../helpers.js"
//import { validateFunc } from '../helpers.js';

const router = Router();

router
  .route('/')

    // GET route for displaying the form
.get('/create-event', function(req, res) {
    res.render('posts');
  })
  
  // POST route for handling the form submission
.post('/create-event', function(req, res) {
    // Extract data from the form
    const category = req.body.category;
    const content = req.body.postedContent;
    
    // Process the data and do something with it
    // ...
  
    // Redirect the user to the same page and refresh somehow to see the page loaded with the new post that is created.
    res.redirect('/posts');
  })

// GET route for displaying the search form
.get('/search-posts', function(req, res) {
    const showIdField = req.query.searchBy === 'id';
    const show = req.query.searchBy !== 'all' && !showIdField;
  
    res.render('searchPosts', {
      showIdField,
      show
    });
  })
  
  // POST route for handling the search query
.post('/search-posts', function(req, res) {
    const searchBy = req.body.searchBy;
    const id = req.body.id;
    const category = req.body.category;
    const postContent = req.body.postContent;
    
    // Process the search query and retrieve the matching posts
    // ...
  
    // Render the search results view
    res.render('search-results', {
      posts: matchedPosts
    });
  })

// GET route for displaying the remove post form
app.get('/remove-posts', function(req, res) {
    res.render('removePosts');
  });
  
  // POST route for removing the post
  app.post('/remove-posts', function(req, res) {
    const id = req.body.id;
    
    // Check if the post with the specified ID exists in the database
    // If it does, remove it
    // Otherwise, show an error message
  
    // Redirect the user to a confirmation page
    res.redirect('/getAllPosts');
  })
  
  // GET route for displaying the update post form
app.get('/update-post', function(req, res) {
    res.render('updatePosts');
  });
  
  // POST route for updating the post
  app.post('/update-post', function(req, res) {
    const id = req.body.id;
    const category = req.body.category;
    const postedContent = req.body.postedContent;
  
    // Check if the post with the specified ID exists in the database
    // If it does, update it with the new category and posted content
    // Otherwise, show an error message
  
    // Redirect the user to a confirmation page
    res.redirect('/getAllPosts');
  })
  
  
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

//   try{
//     const post = await postData.getPostById(req.params.id);
//     return res.status(200).json(post);
//   }catch(e){
//     return res.status(404).json({error:e.message});
//   }
//     try{
//       const postUpdate = await postData.update(req.params.id,category,content,img);
//       return res.status(200).json(postUpdate);
//     }catch(e){
//       return res.status(400).json({error:e.message})
//     }

  });

export default router;*/