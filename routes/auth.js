import {Router} from 'express';
import moment from 'moment';
//import {userData} from '../data/index.js';
//import { userData } from '../data/index.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import validation from '../validationchecker.js';
//import { requireAuth } from '../app.js';
const router = Router();

router.route('/').get(async(req,res)=>{
    return res.status(200).render('home',{title:"Home Page"});
});

router.route('/login').get(async(req,res)=>{
    return res.status(200).render('login/login',{title:"login Page"});
});

router.route('/login').post(async(req,res)=>{
    try{

        let {uname,psw} = req.body;
        uname = validation.checkEmail(uname);
        psw = validation.checkPassword(psw);

        const {sessionUser} = await userData.checkUser(uname,psw);
        req.session.userId = sessionUser.userId;
        req.session.userName = sessionUser.userName;
        return res.redirect('/user');
    }catch(e){
        console.log(e);
        return res.redirect('/signup');
    }
});

router.route('/signup').get(async(req,res)=>{
    return res.status(200).render('login/signup',{title:"Signup Page"});
});

router.route('/signup').post(async(req,res)=>{
    try{
        
        const {firstname,lastname,username,email,psw,dob,dept} = req.body;
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
        const date = moment(dob).format('MM-DD-YYYY');
        //const user = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
        //console.log(user);
        //const {sessionUser} = await userData.;
        const {sessionUser}  = await userData.createUser(firstname,lastname,username,email,psw,dob,dept);
        console.log(sessionUser);

        req.session.userId = sessionUser.userId;
        req.session.userName = sessionUser.userName;
        console.log(req.session.userId);
        console.log(req.session.userName);
        return res.redirect('/user');
        //return res.json(newuser);
    }catch(e){
        console.log(e);
        return res.redirect('/signup'); 
    }
});

/*const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId && req.session.userName) {
      // user is authenticated
      next();
    } else {
      // user is not authenticated
      return res.redirect('/login');
    }
};*/

router.route('/user').get(async(req,res)=>{
    const userId = req.session.userId;
    const userName = req.session.userName;
    console.log(userName);
    console.log(userId);
    return res.render('homepage',{userId:userId,userName:userName});

});

router.route('/profile').get(async(req,res)=>{

    const id = req.session.userId;
    const user = await userData.getUserByID(id);
    console.log(user);
    return res.render('profile',{user:user});
});

router.route('/post').get(async(req, res)=>{
    res.render('posts');
  });

router.route('/post').post(async(req,res)=>{

    const{category,postedContent} = req.body;
    console.log(postedContent);
    try{
        const post = await postData.createPost(category,postedContent);
        console.log(post);
        console.log("The post is posted");
    }catch(e){
        console.log(e)
    }

});
export default router;