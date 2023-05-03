import {Router} from 'express';
import moment from 'moment';
//import {userData} from '../data/index.js';
//import { userData } from '../data/index.js';
import commentData from '../data/comments.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import eventsData from '../data/events.js'
import validation from '../validationchecker.js';
//import { requireAuth } from '../app.js';
import multer from "multer";
import path from "path";

import xss from 'xss';
import { comments, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
const router = Router();

router.route('/').get(async(req,res)=>{
    if(req.session.userId){
        return res.status(200).redirect('/homepage');
    }
    else{
    return res.status(200).render('login');
    }
});

router.get('/login', async (req, res) => {
return res.status(200).render('login', { title: 'Login Page' });
});


  
router.post('/login', async (req, res) => {
try {
    let { emailAddressInput, passwordInput } = req.body;
    // console.log(emailAddressInput)
    // console.log(passwordInput)
    emailAddressInput = validation.checkEmail(emailAddressInput);
    passwordInput = validation.checkPassword(passwordInput);
    // console.log(emailAddressInput)
    // console.log(passwordInput)
    const sessionUser = await userData.checkUser(emailAddressInput, passwordInput);
    // console.log(sessionUser);
    req.session.userId = sessionUser.userId;
    console.log('Welcome',req.session.userId);

    req.session.userName = sessionUser.userName;
    console.log('welcome abc',req.session.userName);

    return res.redirect('/homepage');
} catch (e) {
    return res.redirect('/login');
}
});

router.route('/register').get(async(req,res)=>{
    return res.status(200).render('register',{title:"Register Page"});
});

router.route('/register').post(async(req,res)=>{
    try{
        // removed dept
        let firstName = xss(req.body.firstName);
        console.log("65")
        let lastName = xss(req.body.lastName);
        console.log("66")
        let userName = xss(req.body.userName);
        console.log("67")
        let email = xss(req.body.email);
        console.log("68")
        let password = xss(req.body.password);
        console.log("69")
        let DOB = xss(req.body.DOB);
        console.log("70")
        let role = xss(req.body.role);
        console.log("71")
        let department = xss(req.body.department);
        console.log("72")
        let user;
        console.log("73")
        if(role === 'admin'){
            console.log("74")
            let authentication = xss(req.body.authentication);
            console.log("75")
            user = await userData.createUser(firstName,lastName,userName,email, password, DOB, role, department, authentication);
        }else{
            console.log("76")
            user  = await userData.createUser(firstName,lastName,userName,email, password, DOB, role, department);
        }
        const date = validation.getDate();
        //const user = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
        //console.log(user);
        //const {sessionUser} = await userData.;
        // console.log(user);
        if(user.insertedUser)
        {
            console.log("98")
            return res.redirect('/login');
        }
        // req.session.userId = sessionUser.userId;
        // req.session.userName = sessionUser.userName;
        // console.log(req.session.userId);
        // console.log(req.session.userName);
      
        //return res.json(newuser);
    }catch(e){
        // console.log(e);
        return res.redirect('/register');
    }
});

// router.route('/updatePassword').get(async(req, res)=>{
//     res.status(200).render('updatePassword');
// },
// router.route('/updatePassword').post(async (req, res) => {
//     let email = xss(req.body.email);
//     const userCollection = await users();
//     userData.updatePassword(email, )
// }), 

router.route('/homepage').get(async(req,res)=>{


    const userId = req.session.userId;
    console.log(userId);
    // console.log(userId)
    //const email = req.session.email;
    //useremail from session and will just keep it
    //const user = await userData.getUserByID(userId);
    //const postList = await userData.getPostList(user.email);
    //user info from ID
    //getpost list if true
    const userName = req.session.userName;
    console.log(userName)
    //const postList = await postData.getAllPosts();
// getpost by userId--> all the post by userID[]. should have delete createDate(5) and
    // for (let x of postList){
    //     let resId = x?.userId;
    //     //console.log(resId);
    //     let resString= resId.toString();
    //     const user = await userData.getUserByID(resString);
    //     x.name =user.userName;
    //     //console.log(user.userName);
    //     //console.log(x.userName);
    //     if(resString === userId){
    //         x.editable =true;
    //         x.deletable = true;
    //     }else{
    //         x.editable = false;
    //         x.deletable = false;
    //     }
    // }
    const postList = await postData.getPostByUserIdTop(userId);
      // const listOfPosts = [{category: "education", content: "Anime"}]
    // posts: postList
    return res.render('homepage',{userId:userId,userName:userName,posts:postList});

});


router.route('/profile').get(async(req,res)=> {
    const id = req.session.userId;
    // console.log(id);
    const user = await userData.getUserByID(id);
    return res.render('profile',{user:user});
});
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images");
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
    
    const userId = req.session.userId;

    const postList = await postData.getAllPosts();
    for (let x of postList){
        let resId = x?.userId;
       
        //console.log(resId);
        
        let resString= resId.toString();

        const user = await userData.getUserByID(resString);
        x.name =user.userName;
        //console.log(user.userName);
   
        //console.log(x.userName);
        if(resString === userId){
            x.editable =true;
            x.deletable = true;
        }else{
            x.editable = false;
            x.deletable = false;
        }
    }

      return res.render('posts',{posts:postList});
    })
    .post(uploadImage, async(req,res)=>{
      const id = req.session.userId;
    //   console.log(id);
      const userName = req.session.userName;
  
      const{postCategory,postContent} = req.body;
    //   console.log(postContent);
  
      try{
          let imagePath = '';
          if (req.file) {
            imagePath = req.file.path.replace('public', '');
          } else {
            imagePath = 'images/default.jpg';
          }
  
          const post = await postData.createPost(postCategory, imagePath, postContent, id, req);
          const user  = await userData.putPost(id,post._id);
          console.log(user);
          console.log(post);
          console.log("The post is posted");
          return res.redirect('/homepage');
      }catch(e){
        //   console.log(e)
          return res.render('posts',{Error:e});
      }
  });

  router.route('/events').get(async (req, res) => {
    try {
      
    const userId = req.session.userId;
    if (!userId) {
        throw new Error('User ID not found in session');
    }
      
      //const userCollection = await users();
      const user = await userData.getUserByID(userId);
      console.log('The user is ',user);

      if(!user){
          throw new Error('No user found');
      }
  
      console.log("hello bro!!",userId);
      
  
      const events = await eventsData.getAllEvents();
      let isAdmin;
      if(user.role === 'admin'){
        isAdmin = true;
        for (const x of events){
            x.editable =true;
            x.deletable = true;
        }
      }


    //   for (let x of events){

    //     let resId = x?.userId;        
    //     let resString= resId.toString();

    //     const user = await userData.getUserByID(resString);
    //     x.name =user.userName;
    //     //console.log(user.userName);
    //     //console.log(resString);
    //     //console.log(x.userName);
    //     if(resString === userId){
    //         x.editable =true;
    //         x.deletable = true;
    //     }else{
    //         x.editable = false;
    //         x.deletable = false;
    //     }
    // }

  

      return res.render('events', {newEvent: events, isAdmin:isAdmin});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  });


  const eventStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
  
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).slice(2);
      const ext = path.extname(file.originalname);
      const filename = `${timestamp}-${randomString}${ext}`;
      cb(null, filename);
    },
  });


  const eventUpload = multer({ storage: eventStorage });
const eventUploadImage = eventUpload.single("postImage");




  router.route('/events').post(eventUploadImage, async (req, res) => {

    const userId = req.session.userId;
    console.log(userId);
    try{
        let imagePath = '';
        if (req.file) {
          imagePath = req.file.path.replace('public', '');
        } else {
          imagePath = 'images/default.jpg';
        }
      const {eventName, description, buildingName, organizer, seatingCapacity} = req.body;
      const newEvent = await eventsData.createEvent(eventName, description, buildingName, organizer, seatingCapacity, imagePath, req);
      console.log(newEvent);
      return res.redirect('/events');
    //   const gettingAllEvents = await eventsData.getAllEvents();

    //   for (let x of gettingAllEvents){

    //     let resId = x?.userId;        
    //     let resString= resId.toString();

    //     const user = await userData.getUserByID(resString);
    //     x.name =user.userName;

    //     //console.log(user.userName);
    //     //console.log(resString);
    //     //console.log(x.userName);
        
    //     if(resString === userId){
    //         x.editable =true;
    //         x.deletable = true;
    //     }else{
    //         x.editable = false;
    //         x.deletable = false;
    //     }
    // }

      return res.status(200).render('events', {newEvent: gettingAllEvents});
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({error: error});
    }
  });

  router.route('/events/capacity/:id').post(async (req, res) => {
    let id = req.params.id; // fix the id variable assignment
    const {seatingCapacity,attendance} = req.body;
    try{
        let newSeatingCapacity = seatingCapacity;
        if(typeof newSeatingCapacity === 'string') {
          newSeatingCapacity = Number(newSeatingCapacity);
        }
        if(attendance === 'attend') {
          newSeatingCapacity = newSeatingCapacity - 1;
        } else if(attendance === 'cancel') {
          newSeatingCapacity = newSeatingCapacity + 1;
        }
        
        const result = await eventsData.updateCapacity(
            id, // pass the correct id variable
            newSeatingCapacity
        );
        return res.render('events', {newEvent: result});
    }catch (e){
        console.log(e);
        return res.status(400).json({error: e});
    }
});


router.route('/error').get(async (req, res) => {
    //code here for GET
    return res.render('error', {error: "Something"});
}),


router.route('/posts/:id').delete(async(req,res)=>{
    console.log(req.params.id);
    try{
        const user = await userData.getUserByID(req.session.userId);
    if(!user){
        throw 'cannot find user';
    }
    //console.log(user);
    const commentCollection = await comments();
    const post = await commentCollection.find({postId:new ObjectId(req.params.id)}).toArray();
    console.log(post);
    if(post.length !== 0){
        const responsePost = await commentData.removeCommentByPost(req.params.id);
        console.log("hi",responsePost.deleted);
    }
    const response = await postData.removeById(req.params.id);
    console.log("hi",response.deleted);
    //const user = await userData.removePost()
    //const postList = await postData.getAllPosts();
    //res.status(200).send(response);
    //res.send(response);
    return res.sendStatus(200);
}catch(e){
    console.log(e);
}
});

router.route('/posts/:id/comment').post(async(req,res)=>{
    try{
        const userId = req.session.userId;
        const postId = req.params.id;
        const{commentText} =req.body;
        // console.log(postId);
        // console.log(commentText);
        const comment = await commentData.createComment(userId,null,postId,commentText,"post");
        console.log(comment);
        const post = await postData.putComment(postId,comment.commentId);
        // console.log(post);
        console.log('The comment is added');
        return res.sendStatus(200);
    }catch(e){
        console.log(e);
    }
});


router.route('/events/:id').delete(async(req,res)=>{
    //console.log(req.params.id);
    try{
        const user = await userData.getUserByID(req.session.userId);
    if(!user){
        throw 'cannot find user';
    }
    console.log(user);
    if (user.role !== 'admin') throw "Only administrators can delete events.";


    const commentCollection = await comments();
    const event = await commentCollection.find({eventId:new ObjectId(req.params.id)}).toArray();
    console.log(event);
    if(event.length!==0){
        const response = await commentData.removeCommentByEvent(req.params.id);
        console.log("hi",response.deleted);
    }
    if(!event){
        throw "No events found!!"
    }



    const responseEvent = await eventsData.removeEventById(req.params.id);
    console.log(responseEvent);
    

    console.log("hi",responseEvent.deleted);

    return res.sendStatus(200);

    }catch(e){
        console.log(e);
    }
    

    //res.send(response);
    
});


router.route('/events/:id/comment').post(async(req,res)=>{
    try{
        const userId = req.session.userId;
        const eventId = req.params.id;
        const{commentText} =req.body;
        // console.log(postId);
        // console.log(commentText);
        const comment = await commentData.createComment(userId,eventId,null,commentText,"event");
        console.log(comment);
        const post = await eventsData.putComment(eventId,comment.commentId);
        // console.log(post);
        console.log('The comment is added');
        return res.sendStatus(200);
    }catch(e){
        console.log(e);
    }
});

// router.route('/logout')
//   .get(async (req, res) => {
//     if (req.cookies.AuthCookie) {
//       res.clearCookie('AuthCookie');
//     }
//     res.redirect('/');
//   });

// router.route('/add-comment').post(async(req,res)=>{

//     const userId = req.session.userId;
//     const{postId,commentText} =req.body;
//     console.log(postId);
//     console.log(commentText);
//     const comment = await commentData.createPostComment(userId, postId, commentText);
//     const post = await postData.putComment(postId,comment.commentId);
//     // console.log(comment);
//     //userId, postID,commentText ->> 4 things _id
//     //await commentData.c

// });




router.route('/putAttendee').post(async(req, res) => {
    const userId = req.session.userId;
    const eventId = req.body;
    const userCollection = await userData.putAttendee(userId, eventId);
}),

router.route('/removeAttendee').get(async (req, res)=> {
    const userId = req.session.id;
    const eventId = req.body;
    const userCollection = await userData.removeAttendee(userId, eventId);
}),

router
    .route('/reset-password/:id')
    .get(async (req, res) => {
        try {
            return res.render('resetPassword', {id: req.params.id})
        }catch (e){
            return res.status(404).sendFile(path.resolve("public/static/404.html"));
        }
    })
    .post(async (req, res) =>{
        try{
            let newPassword = xss(req.body.newPassword);
            let confirmNewPassword = xss(req.body.confirmNewPassword);
            newPassword = validation.checkPassword(newPassword);
            confirmNewPassword = validation.checkPassword(confirmNewPassword);
            let result = validation.checkIdentify(newPassword, confirmNewPassword);
            if(result){
                const passwordUpdate = await userData.updatePassword(req.params.id, newPassword);
            };
            res.redirect('/login');
        }catch (e){
            return res.status(400).render("/resetPassword",{
                id: req.params.id,
                error: e
            })
        }
    }),

router
    .route('/forgot-password')
    .get(async (req, res) => {
        try {
            return res.render("forgotPassword");
        } catch (e) {
            return res.status(404).sendFile(path.resolve("/public/static/notfound.html"));
        }
    })
    .post(async (req, res) => {
        try {
            let email = xss(req.body.email);
            email = validation.checkEmail(email);

            let checkExist = await userData.getUserByEmail(email);
            await passwordResetByEmail({id: checkExist._id, email: checkExist.email}, res);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: e,
                email: req.body.email
            });
        }
    }),

    router.route('/increaseLikes')
    .post(async (req, res) => {
      const postId = req.body.postId;
      const updatedPost = await postData.increaseLikes(postId);
      return res.json(updatedPost);
    });

    router.route('/increaseDislikes')
    .post(async (req, res) => {
        const postId = req.body.postId;
        const updatedPost = await postData.increaseDislikes(postId);
        return res.json(updatedPost);
    }),
  

  router.route('/logout').get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    return res.render('logout',{title:'Logout'})
  });

  
  router
  .route('/posts/:postId/allComments')
  .get(async (req, res) => {
    const postId = req.params.postId;
    // console.log(postId);
    const comment = await commentData.getPostCommentById(postId)
    // console.log(comment);
    return res.render('allComments', {comment: comment});
  });

  router
  .route('/events/:eventId/allComments')
  .get(async (req, res) => {
    const eventId = req.params.eventId;
    console.log(eventId);
    const comment = await commentData.getEventCommentById(eventId)
    console.log(comment);
    return res.render('allComments', {comment: comment});
  });
 

export default router;