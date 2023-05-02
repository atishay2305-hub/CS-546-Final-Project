import {Router} from 'express';
import commentData from '../data/comments.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import validation from '../validationchecker.js';
//import { requireAuth } from '../app.js';
import multer from "multer";
import path from "path";
import {passwordResetByEmail} from "../email.js";
import xss from 'xss';
import authCheck from "../public/js/validtionChecker.js";

const router = Router();

const displayMap = (location) => {
    // Create a new map centered at Stevens Institute of Technology
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7431, lng: -74.0258},
        zoom: 15
    });

    // Create a geocoder object
    const geocoder = new google.maps.Geocoder();

    // Make a geocoding request for the specific location
    geocoder.geocode({address: location}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            // Extract the latitude and longitude from the geocoding result
            const {lat, lng} = results[0].geometry.location;

            // Create a marker at the specified location
            new google.maps.Marker({
                position: {lat, lng},
                map: map,
                title: location
            });
        } else {
            console.error("Geocode was not successful for the following reason: " + status);
        }
    });
};


router.route('/').get(async (req, res) => {
    return res.redirect('login');
});

router
    .route('/login')
    .get(async (req, res) => {
        try {
            return res.render("login");
        } catch (e) {
            return res.status(404).sendFile(path.resolve("/public/static/notfound.html"));
        }
    })
    .post(async (req, res, next) => {
        try {
            let email = xss(req.body.email);
            let password = xss(req.body.password);
            email = validation.checkEmail(email);
            password = validation.checkPassword(password);
            const sessionUser = await userData.checkUser(email, password);
            req.session.userId = sessionUser.userId;
            req.session.userName = sessionUser.userName;
            res.redirect('/homepage');
        } catch (e) {
            return res.status(401).json({
                success: false,
                email: req.body.email,
                password: req.body.password,
                error: e
            });
        }
    })


router.route('/register').get(async (req, res) => {

    return res.status(200).render('register', {title: "Register Page"});
});

router.route('/register').post(async (req, res) => {
    try {

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
        if (role === 'admin') {
            let authentication = xss(req.body.authentication);
            user = await userData.createUser(firstName, lastName, userName, email, password, DOB, role, department, authentication);
        } else {
            user = await userData.createUser(firstName, lastName, userName, email, password, DOB, role, department);
        }
        const date = validation.getDate();
        //const user = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
        //console.log(user);
        //const {sessionUser} = await userData.;
        console.log(user);
        if (user.insertedUser) {
            return res.redirect('/login');
        }
        return res.status(200).json({success: true, message: "Registration complete", data: req.session.user});
    } catch (e) {
        return res.status(400).json({
            success: false,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            dateOfBirth: req.body.dateOfBirth,
            error: e,
        })
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


router.route('/error').get(async (req, res) => {
    //code here for GET
    return res.render('error', {error: "Something"});
});


router.route('/posts/:id').delete(async (req, res) => {
    console.log(req.params.id);

    const response = await postData.removeById(req.params.id);
    console.log("hi", response.deleted);
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


router.route('/putAttendee').post(async (req, res) => {
    const userId = req.session.userId;
    const eventId = req.body;
    const userCollection = await userData.putAttendee(userId, eventId);
});

router.route('/removeAttendee').get(async (req, res) => {
    const userId = req.session.id;
    const eventId = req.body;
    const userCollection = await userData.removeAttendee(userId, eventId);
});

router
    .route('/reset-password/:id')
    .get(async (req, res) => {
        try {
            return res.render('resetPassword', {id: req.params.id})
        } catch (e) {
            return res.status(404).sendFile(path.resolve("public/static/404.html"));
        }
    })
    .post(async (req, res) => {
        try {
            let newPassword = xss(req.body.newPassword);
            let confirmNewPassword = xss(req.body.confirmNewPassword);
            newPassword = validation.checkPassword(newPassword);
            confirmNewPassword = validation.checkPassword(confirmNewPassword);
            let result = validation.checkIdentify(newPassword, confirmNewPassword);
            if (result) {
                const passwordUpdate = await userData.updatePassword(req.params.id, newPassword);
            }
            ;
            res.redirect('/login');
        } catch (e) {
            return res.status(400).render("/resetPassword", {
                id: req.params.id,
                error: e
            })
        }
    });

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
    });

router.route('/homepage').get(async (req, res) => {
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
    // console.log(postList);
    //
    //console.log(postList);
    for (let x of postList) {
        let resId = x?.userId;

        console.log(resId);

        let resString = resId.toString();

        const user = await userData.getUserByID(resString);
        x.name = user.userName;
        console.log(user.userName);
        console.log(resString);
        console.log(x.userName);
        if (resString === userId) {
            x.editable = true;
            x.deletable = true;
        } else {
            x.editable = false;
            x.deletable = false;
        }
    }

    // const listOfPosts = [{category: "education", content: "Anime"}]
    // posts: postList
    return res.render('homepage', {
        userId: userId,
        userName: userName,
        posts: postList,
    });

});


router.route('/profile').get(async (req, res) => {
    const id = req.session.userId;
    console.log(id);
    const user = await userData.getUserByID(id);
    return res.render('profile', {user: user});
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

const upload = multer({storage: storage});
const uploadImage = upload.single("postImage");


router.route('/posts')
    .get(async (req, res) => {

        return res.render('posts');
    })
    .post(uploadImage, async (req, res) => {
        const id = req.session.userId;
        console.log(id);
        const userName = req.session.userName;

        let category = xss(req.body.category);
        let postContent = xss(req.body.postContent);
        category = validation.checkCategory(category);
        postContent = validation.checkPhrases(postContent);
        console.log(postContent);
        let address = "";
        try {
            let imagePath;
            if (req.file) {
                imagePath = req.file.path.replace('public', '');
            } else {
                imagePath = 'images/default.jpg';
            }

            if(category === 'lost&found'){
                address = xss(req.body.address);
                address = validation.checkAddress(address);
            }
            const post = await postData.createPost(category, imagePath, postContent, userName, address);
            const user = await userData.putPost(id, post._id);
            console.log(user);
            console.log(post);
            console.log("The post is posted");
            return res.redirect('/homepage');
        } catch (e) {
            return res.status(400).json({
                success: false,
                category: req.body.category,
                content: req.body.postContent,
                address: req.body.address
            });
        }
    });


router.route('/posts/:id/comment').post(async (req, res) => {
    try {
        const userId = req.session.userId;
        const postId = req.params.id;
        const {commentText} = req.body;
        // console.log(postId);
        // console.log(commentText);
        const comment = await commentData.createPostComment(userId, postId, commentText);
        console.log(comment);
        const post = await postData.putComment(postId, comment.commentId);
        // console.log(post);
        console.log('The comment is added');
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
    }
});

router
    .route('posts/:category')
    .get(async (req, res) => {
        try {
            let category = req.params.category;
            category = validation.checkCategory(category);
            let postList = await postData.getAllPosts({category: category});
            res.render('post-list', {category, posts: postList});
        } catch (e) {
            return res.status(500).sendFile(path.resolve("/public/static/notfound.h tml"));
        }
    })

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
    });


router.route('/logout').get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    return res.render('logout', {title: 'Logout'})
});


router
    .route('/posts/:postId/allComments')
    .get(async (req, res) => {
        const postId = req.params.postId;
        console.log(postId);
        const comment = await commentData.getPostCommentById(postId)
        console.log(comment);
        return res.render('allComments', {comment: comment});
    });

export default router;
