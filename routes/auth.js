import {Router} from 'express';
import moment from 'moment';
//import {userData} from '../data/index.js';
//import { userData } from '../data/index.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import validation from '../validationchecker.js';
import { events } from '../config/mongoCollections.js';
//import { requireAuth } from '../app.js';
const router = Router();

router.route('/').get(async(req,res)=>{
    return res.status(200).render('login',{title:"Home Page"});
});

// router.route('/').get(async (req, res) => {
//     //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
//     if (req.session.user) {
//         if (req.session.user.role === 'admin') {
//             return res.redirect('/admin');
//         } else if (req.session.user.role === 'user') {
//             return res.redirect('/protected');
//         }
//     }else {
//         res.redirect('/login');
//     }
// });

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
        return res.redirect('/user');
    }catch(e){
        console.log(e);
        return res.redirect('/register');
    }
});


//     .post(async (req, res) => {
//         //code here for POST
//         let {emailAddressInput, passwordInput} = req.body;
//         try {
//             emailAddressInput = validator.checkEmail(emailAddressInput);
//             passwordInput = validator.checkPassword(passwordInput);
//             const user = await checkUser(emailAddressInput, passwordInput);
//             req.session.user = {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 emailAddress: user.emailAddress,
//                 role: user.role
//             };
//             if (user.role === "admin") {
//                 res.redirect('/admin');
//             } else {
//                 res.redirect('/protected');
//             }
//         } catch (e) {
//                 return res.status(400).render('error', {
//                     title: "Error",
//                     message: e
//                 });
//         }
//     });






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

// router
//     .route('/register')
//     .get(async (req, res) => {
//         //code here for GET
//         if (req.session.user) {
//             if (req.session.user.role === 'admin') {
//                  res.redirect('/admin');
//             } else if (req.session.user.role === 'user') {
//                  res.redirect('/protected');
//             }
//         }else {
//             res.render('register', {title: "Register"});
//         }
//     })
//     .post(async (req, res) => {
//         //code here for POST
//         let {
//             firstNameInput,
//             lastNameInput,
//             emailAddressInput,
//             passwordInput,
//             confirmPasswordInput,
//             roleInput
//         } = req.body;
//         try {
//             firstNameInput = validator.checkLegitName(firstNameInput);
//             lastNameInput = validator.checkLegitName(lastNameInput);
//             emailAddressInput = validator.checkEmail(emailAddressInput);
//             passwordInput = validator.checkPassword(passwordInput);
//             confirmPasswordInput = validator.checkPassword(confirmPasswordInput);
//             roleInput = validator.checkRole(roleInput);
//             if (passwordInput !== confirmPasswordInput) throw "Passwords do not match";
//         } catch (e) {
//             return res.status(400).render('error', {title: "Error", message: e});
//         }

//         try {
//             const user = await createUser(firstNameInput,
//                 lastNameInput,
//                 emailAddressInput,
//                 passwordInput,
//                 roleInput);
//             if (user.insertedUser) {
//                 res.redirect('/login');
//             }
//         } catch (e) {
//             return res.status(500).render('error', {title: "Error", message: "Internal Server Error"});
//         }
//     });

router.route('/user').get(async(req,res)=>{
    const userId = req.session.userId;
    const userName = req.session.userName;
    // console.log(userName);
    // console.log(userId);
    return res.render('homepage',{userId:userId,userName:userName});
});


router.route('/profile').get(async(req,res)=> {
    const id = req.session.userId;
    console.log(id);
    const user = await userData.getUserByID(id);
    res.render('profile',{user:user});
});

router.route('/posts').get(async(req, res)=>{
    res.render('posts', {user : user});
  });

router.route('/posts').post(async(req,res)=>{

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

router.route('/error').get(async (req, res) => {
    //code here for GET
    res.render('error', {message: ""});
});


export default router;