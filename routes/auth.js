import {Router} from 'express';
import moment from 'moment';
import {userData} from '../data/index.js';
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
        const {sessionUser} = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
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

const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId && req.session.userName) {
      // user is authenticated
      next();
    } else {
      // user is not authenticated
      return res.redirect('/login');
    }
};

router.route('/user').get(async(req,res)=>{
    const userId = req.session.userId;
    const userName = req.session.userName;
    console.log(userName);
    console.log(userId);
    return res.render('homepage',{userId:userId,userName:userName});

});



export default router;