import {Router} from 'express';
import moment from 'moment';
//import {userData} from '../data/index.js';
//import { userData } from '../data/index.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import validation from '../validationchecker.js';
import commentData from '../data/comments.js';
import multer from 'multer';
import path from 'path';
//import { requireAuth } from '../app.js';
const router = Router();

router.route('/').get(async(req,res)=>{
    return res.status(200).render('login',{title:"Home Page"});
});

router.route('/login').get(async(req,res)=>{
    return res.status(200).render('login',{title:"login Page"});
});

router.route('/login').post(async(req,res)=>{
    try{

        let {emailAddressInput,passwordInput} = req.body;
        emailAddressInput = validation.checkEmail(emailAddressInput);
        passwordInput = validation.checkPassword(passwordInput);

        const {sessionUser} = await userData.checkUser(emailAddressInput,passwordInput);
        req.session.userId = sessionUser.userId;
        req.session.userName = sessionUser.userName;
        return res.redirect('/homepage');
    }catch(e){
        console.log(e);
        return res.redirect('/register');
    }
});

router.route('/register').get(async(req,res)=>{
    return res.status(200).render('register',{title:"Register Page"});
});

router.route('/register').post(async(req,res)=>{
    try{
        // removed dept
        const {firstName,lastName,userName,email,password,DOB, dept} = req.body;
        /*try{
            firstname = validation.checkString(firstname, 'First name');
            lastname = validation.checkString(lastname, 'Last name');
            email = validation.checkString(email, 'email');
            password = validation.checkString(psw, 'Password');
            dob = validation.checkString(dob, 'date of birth');
            department = validation.checkString(dept, 'department');
            validation.emailValidation(email);
        }catch(e){
            console.log(e);
            return res.status(400).send(e); 
        }*/
        const date = moment(DOB).format('MM-DD-YYYY');
        //const user = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
        //console.log(user);
        //const {sessionUser} = await userData.;
        const user  = await userData.createUser(firstName,lastName,userName,email,password,DOB, dept);
        console.log(user);
        if(user.createUser)
        {
            return res.redirect('/login');
        }

        req.session.userId = sessionUser.userId;
        req.session.userName = sessionUser.userName;
        console.log(req.session.userId);
        console.log(req.session.userName);
        return res.redirect('/homepage');
        //return res.json(newuser);
    }catch(e){
        console.log(e);
        return res.redirect('/register'); 
    }
});



router.route('/homepage').get(async(req,res)=>{
    const userId = req.session.userId;
    //const email = req.session.email;    
    //useremail from session and will just keep it
    //const user = await userData.getUserByID(userId);
    //const postList = await userData.getPostList(user.email);

  
    //user info from ID
    //getpost list if true 
    const userName = req.session.userName;
    //console.log(userName);
    //console.log(postList);
    const postList = await postData.getAllPosts();

    //console.log(postList);
    for (let x of postList){
        let resId = x?.userId;
       
        //console.log(resId);
        
        let resString= resId.toString();

        const user = await userData.getUserByID(resString);
        x.name =user.userName;
        //console.log(user.userName);
        //console.log(resString);
        //console.log(x.userName);
        if(resString === userId){
            x.editable =true;
            x.deletable = true;
        }else{
            x.editable = false;
            x.deletable = false;
        }
    }
    //console.log(postList);
    
    //loop through the post and implement following logic[array]
    //List of posts and indiviudal post.UsedId = sesstion ID[add property editable or deletable false/true]
    //handlebars array of posts if button 
    return res.render('homepage',{userId:userId,userName:userName,posts:postList});

});


// router.route('/profile').get(async(req,res)=> {
//     const id = req.session.userId;
//     console.log(id);
//     const user = await userData.getUserByID(id);

//     res.render('profile',{user:user});
// });


router.get('/profile', async function(req, res, next) {
      // Find the user by their ID
      const user = await userData.getUserByID(req.session.userId);
      console.log(user.postIDs);

      const posts = await postData.getPostByUserId(req.session.userId);
      
      console.log(posts.commentIds);
        
      //const postCollection = await posts();
      // Get all of the user's posts
      //onst posts = await postCollection.findOne({ userId: user._id });
  
      // Create an array of promises to get the comments for each post
    //   const promises = user.postIDs.map(async (postId) => {
    //     const post = await postData.getPostById(postId);
    //     const comment = await commentData.getPostCommentById(postId);
    //     return { post, comment };
    //   });
      
    //   try {
    //     const postsWithComments = await Promise.all(promises);
    //     // console.log(postsWithComments);
        return res.render('profile',{user,posts});
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).send('Internal Server Error');
    //   }
      
      
});
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).slice(2);
      const ext = path.extname(file.originalname);
      const filename = `${timestamp}-${randomString}${ext}`;
      cb(null, filename);
    },
  });
  const upload = multer({ storage: storage });

  const uploadImage = upload.single("postImage");
 
  router.route('/posts')
    .get(async(req, res)=>{
      return res.render('posts');
    })
    .post(uploadImage, async(req,res)=>{
      const id = req.session.userId;
      console.log(id);
      const userName = req.session.userName;
      const{postCategory,postContent,} = req.body;
      console.log(postContent);
      try{
          let imagePath = '';
          if (req.file) {
            imagePath = req.file.path.replace('images', '');
          } else {
            imagePath = 'images/default.jpg';
          }
          console.log(imagePath);
          const post = await postData.createPost(postCategory, imagePath, postContent,id,req);
          console.log(post);
          const user  = await userData.putPost(id,post._id);
          console.log(user);
          console.log(post);
          console.log("The post is posted");
          return res.redirect('/homepage');
      }catch(e){
          console.log(e)
          return res.render('posts',{Error:e});
      }
  });

  router.route('/posts/:id').delete(async(req,res)=>{
    console.log(req.params.id);
    const response = await postData.removeById(req.params.id);
    console.log("hi",response.deleted);
    //const user = await userData.removePost()
    //const postList = await postData.getAllPosts();
    //res.status(200).send(response);
    //res.send(response);
    return res.sendStatus(200);
  });

router.route('/posts/:id/comment').post(async(req,res)=>{
    try{

        const userId = req.session.userId;
        const postId = req.params.id;
        const{commentText} =req.body;
        console.log(postId);
        console.log(commentText);
        const comment = await commentData.createPostComment(userId,postId,commentText);
        console.log();
        const post = await postData.putComment(postId,comment.commentId);
        console.log(post);
        console.log('The comment is added');
        return res.redirect(`/profile`);
    }catch(e){
        console.log(e);
    }
    
    //userId, postID,commentText ->> 4 things _id
    //await commentData.c
});

// router.route('/posts/:id').get(async(req,res)=>{

//     const post = await postData.getPostById(id);
//     console.log(post);
// });


export default router;