import {Router} from 'express';
import moment from 'moment';
//import {userData} from '../data/index.js';
//import { userData } from '../data/index.js';
import commentData from '../data/comments.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import validation from '../validationchecker.js';
//import { requireAuth } from '../app.js';
import multer from "multer";
import path from "path";

import xss from 'xss';
const router = Router();

router.route('/').get(async(req,res)=>{
    return res.status(200).render('login');
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
    console.log(sessionUser);
    req.session.userId = sessionUser.userId;
    req.session.userName = sessionUser.userName;
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
        let lastName = xss(req.body.lastName);
        let userName = xss(req.body.userName);
        let email = xss(req.body.email);
        let password = xss(req.body.password);
        let DOB = xss(req.body.DOB);
        let role = xss(req.body.role);
        let department = xss(req.body.department);
        let user;
        if(role === 'admin'){
            let authentication = xss(req.body.authentication);
            user = await userData.createUser(firstName,lastName,userName,email, password, DOB, role, department, authentication);
        }else{
            user  = await userData.createUser(firstName,lastName,userName,email, password, DOB, role, department);
        }
        const date = validation.getDate();
        //const user = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
        //console.log(user);
        //const {sessionUser} = await userData.;
        console.log(user);
        if(user.insertedUser)
        {
            return res.redirect('/login');
        }
        // req.session.userId = sessionUser.userId;
        // req.session.userName = sessionUser.userName;
        // console.log(req.session.userId);
        // console.log(req.session.userName);
      
        //return res.json(newuser);
    }catch(e){
        console.log(e);
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
    // console.log(userName);
    //console.log(postList);
    const postList = await postData.getAllPosts();
    console.log(postList);

    //console.log(postList);
    for (let x of postList){
        let resId = x?.userId;
       
        console.log(resId);
        
        let resString= resId.toString();

        const user = await userData.getUserByID(resString);
        x.name =user.userName;
        console.log(user.userName);
        console.log(resString);
        console.log(x.userName);
        if(resString === userId){
            x.editable =true;
            x.deletable = true;
        }else{
            x.editable = false;
            x.deletable = false;
        }
    }
    
    return res.render('homepage',{userId:userId,userName:userName,posts:postList});

});


router.route('/profile').get(async(req,res)=> {
    const id = req.session.userId;
    console.log(id);
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
      return res.render('posts');
    })
    .post(uploadImage, async(req,res)=>{
      const id = req.session.userId;
      console.log(id);
      const userName = req.session.userName;
  
      const{postCategory,postContent} = req.body;
      console.log(postContent);
  
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
          console.log(e)
          return res.render('posts',{Error:e});
      }
  });
  

router.route('/error').get(async (req, res) => {
    //code here for GET
    return res.render('error', {error: "Something"});
}),


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

// router.route('/logout')
//   .get(async (req, res) => {
//     if (req.cookies.AuthCookie) {
//       res.clearCookie('AuthCookie');
//     }
//     res.redirect('/');
//   });

router.route('/add-comment').post(async(req,res)=>{

    const userId = req.session.userId;
    const{postId,commentText} =req.body;
    console.log(postId);
    console.log(commentText);
    const comment = await commentData.createPostComment(userId, postId, commentText);
    console.log(comment);
    //userId, postID,commentText ->> 4 things _id
    //await commentData.c

});


router.route('/putAttendee').post(async(req, res) => {
    const userId = req.session.userId;
    const eventId = req.body;
    const userCollection = await userData.putAttendee(userId, eventId);
})

router.route('/removeAttendee').get(async (req, res)=> {
    const userId = req.session.id;
    const eventId = req.body;
    const userCollection = await userData.removeAttendee(userId, eventId);
})



  router.route('/logout').get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    return res.render('logout',{title:'Logout'})
  });

export default router;