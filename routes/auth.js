import { Router } from 'express';
import commentData from '../data/comments.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import discussData from '../data/discussion.js'
import eventsData from '../data/events.js'
import validation from '../validationchecker.js';
import multer from "multer";
import path from "path";
import bcrypt from 'bcrypt';
import { passwordResetByEmail } from "../email.js";
import xss from 'xss';
import { comments, users, posts } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import fs from 'fs';

const router = Router();


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


router.route('/').get(async (req, res) => {

    if (req.session.user) {
        return res.status(200).redirect('/homepage');
    } else {
        return res.status(200).render('login', { title: 'Login' });
    }
});

router
    .route('/login')
    .get(async (req, res) => {
        try {
            return res.render("login", { title: 'Login' });
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
            req.session.user = {
                userName: sessionUser.userName,
                email: sessionUser.emailAddress,
                userId: sessionUser.userId,
                role: sessionUser.role
            };
            return res.redirect('/homepage');
        }

        catch (e) {
            return res.status(401).json({
                success: false,
                email: req.body.email,
                password: req.body.password,
                error: e
            });
        }
    })


router
    .route('/register')
    .get(async (req, res) => {

        return res.status(200).render('register', { title: "Register Page" });
    })
    .post(async (req, res) => {


        try {

            let firstName = xss(req.body.firstName);
            let lastName = xss(req.body.lastName);
            let userName = xss(req.body.userName);
            let email = xss(req.body.email);
            let password = xss(req.body.password);
            let DOB = xss(req.body.DOB);
            DOB = validation.checkDOB(DOB);
            let role = xss(req.body.role);
            let department = xss(req.body.department);
            let user;
            const userCollection = await users();
            const existingUser = await userCollection.findOne({ email: email });
            if (existingUser) {
                return res.status(401).json({
                    success: false,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userName: req.body.userName,
                    email: req.body.email,
                    DOB: req.body.DOB,
                    password: req.body.password,
                    role: req.body.role,
                    department: req.body.department,
                    authentication :req.body.authentication || "",
                    message: "either username or email already exists."
                });
            }
            if (role === 'admin') {
                let authentication = xss(req.body.authentication);
                user = await userData.createUser(firstName, lastName, userName, email, password, DOB, role, department, authentication);
            } else {
                user = await userData.createUser(firstName, lastName, userName, email, password, DOB, role, department);
            }



            if (user.insertedUser) {
                return res.redirect('/login');
            }
            return res.status(200).json({
                success: true,
                message: "Registration complete",
                data: req.session.user
            });
        } catch (e) {
            return res.status(400).json({
                success: false,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                email: req.body.email,
                DOB: req.body.DOB,
                password: req.body.password,
                role: req.body.role,
                error: e,
            })
        }
    });

    router.route('/homepage').get(async (req, res) => {
        const userId = req.session.user.userId;
        const userName = req.session.user.userName;
        const commentCollection = await comments();
        const postList = await postData.getPostByUserIdTop(userId);
        if(postList.length !== 0){
            for (let x of postList) {
                x.editable = true;
                x.deletable = true;
                if (x.category === 'lost&found') {
                    x.addressCheck = true;
                }
                x.result = [];
                if(x.commentIds.length !== 0){
                    for (let y of x.commentIds) {
                        const comment = await commentCollection.findOne({ _id: y });
                        x.result.push({
                            commentUserName: comment.userName,
                            commentContent: comment.contents
                        })
                    }
                }
            }
        }
        let resu=[];
        const eventList = await eventsData.getAllEvents();
        if(eventList.length !== 0){
             resu = eventList.filter((event) => {
                const attendees = event.attendees;
                const attendeeIds = Object.values(attendees).map((attendee) => attendee.id);
                return attendeeIds.includes(userId);
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date)) 
            .slice(0, 5);
        }

        return res.render('homepage', {
            userId: userId,
            userName: userName,
            posts: postList,
            events:resu,
            title: 'Homepage'
        });
    });




router.route('/posts')
    .get(async (req, res) => {
        let posts = await postData.getAllPosts();
        posts = posts.map(post => {
            return { ...post, _id: post._id.toString() };
        });
        const getComments = posts.map(post => commentData.getPostCommentById(post._id.toString()));
        const allComment = await Promise.all(getComments);
        const comments = allComment.reduce((acc, comment, index) => {
            const postId = posts[index]._id.toString();
            if (acc[postId]) {
                acc[postId].push(comment);
            } else {
                acc[postId] = [comment];
            }

            return acc;
        }, {});

        Object.values(comments).forEach(commentArr => {
            commentArr.sort((a, b) => b.created_Date - a.created_Date);
        });

        return res.render('posts', {role: req.session.user.role, posts: posts, comments: comments, title: 'Posts'});
    })
    .post(uploadImage, async (req, res) => {
        const id = req.session.user.userId;
        const userName = req.session.user.userName;
        const role = req.session.user.role;
        if (role === 'admin') {
            return res.status(401).json({
                success: false,
                message: "Post cannot generate by admin"
            });
        }
        let category = xss(req.body.category);
        let postContent = xss(req.body.postContent);
        category = validation.checkCategory(category);
        postContent = validation.checkPhrases(postContent);
        let address = "";
        try {
            let imagePath;
            if (req.file) {
                imagePath = req.file.path.replace('public', '');
            } else {
                imagePath = '/images/default.jpg';
            }

            if (category === 'lost&found') {
                address = xss(req.body.address);
                address = validation.checkAddress(address);
            }
            const post = await postData.createPost(category, imagePath, postContent, userName, address);
            const user = await userData.putPost(id, post._id);

            return res.redirect('/posts');
        } catch (e) {
            return res.status(400).json({
                success: false,
                category: req.body.category,
                content: req.body.postContent,
                address: req.body.address
            });
        }
    });

router.route('/profile').get(async (req, res) => {
    const id = req.session.user.userId;
    const user = await userData.getUserByID(id);
    return res.render('profile', {user: user, title: 'User Profile'});
});


router.route('/posts/:id/comment').post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const postId = req.params.id;
        const { commentText } = req.body;
        const comment = await commentData.createComment(userId, null, postId, commentText, "post");
        const post = await postData.putComment(postId, comment.commentId);
        return res.sendStatus(200);
        return res.redirect('/posts');
    } catch (e) {
        
    }

});

router
    .route('/reset-password/:id')
    .get(async (req, res) => {
        try {
            return res.render('resetPassword', { id: req.params.id, title: 'Reset Password' })
        } catch (e) {
            return res.status(404).sendFile(path.resolve("public/static/404.html"));

        }
    })
    .post(async (req, res) => {
        try {
            let id = xss(req.body.id);
            let newPassword = xss(req.body.newPassword);
            let confirmNewPassword = xss(req.body.confirmNewPassword);
            id = validation.checkId(id);
            newPassword = validation.checkPassword(newPassword);
            confirmNewPassword = validation.checkPassword(confirmNewPassword);
            let result = validation.checkIdentify(newPassword, confirmNewPassword);
            if (result) {
                const passwordUpdate = await userData.updatePassword(id, newPassword);
            }
            res.redirect('/login');
        } catch (e) {
            return res.status(400).render("resetPassword", {
                success: false,
                id: req.body.id,
                error: e
            })
        }
    });

router
    .route('/change-password/:id')
    .get(async (req, res) => {
        try {
            console.log(req.query);
            return res.render('changePassword', { id: req.params.id, title: 'Change Password' })
        } catch (e) {
            return res.status(404).sendFile(path.resolve("public/static/404.html"));

        }
    })
    .post(async (req, res) => {
        try {

            let id = xss(req.params.id);
            let newPassword = xss(req.body.newPassword);
            let oldPassword = xss(req.body.oldPassword);

            id = validation.checkId(id);

            newPassword = validation.checkPassword(newPassword);
            oldPassword = validation.checkPassword(oldPassword);
            const user = await userData.getUserByID(id);

            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (passwordMatch) {

                const passwordUpdate = await userData.updatePassword(id, newPassword);
            } else {
                // res.status(400).render("changePassword", { error: "Password did not match",id:id });
                // let error=true;
                // res.redirect(`/change-password/${id}?error=${error}`);
                return res.status(400).render("changePassword", {
                    success: false,
                    id: req.body.id,
                    error: "the old password you entered is incorrect"
                })
            }

            res.redirect('/logout');
        } catch (e) {
            return res.status(400).render("changePassword", {
                success: false,
                id: req.body.id,
                error: e
            })
        }
    });

router
    .route('/forgot-password')
    .get(async (req, res) => {
        try {
            return res.render("forgotPassword", { title: 'Forgot Password' });
        } catch (e) {
            return res.status(404).sendFile(path.resolve("/public/static/notfound.html"));
        }
    })
    .post(async (req, res) => {
        try {
            let email = xss(req.body.email);
            email = validation.checkEmail(email);

            let checkExist = await userData.getUserByEmail(email);
            if(!checkExist) throw `No user with ${email} exist!!`;
            const xyz = await passwordResetByEmail({ id: checkExist._id, email: checkExist.email }, res);
            return xyz;
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: e,
                email: req.body.email
            });

        }
    });

router.use('/logout', (req, res) => {
    if (!req.session.user) {
        return res.render('login', {title: 'Login'});
    }
    req.session.destroy();
    return res.render('logout', {title: 'logout'});
});


router.route('/posts/:id/comment').post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const postId = req.params.id;
        let {commentText} = req.body;
        commentText = validation.checkComments(commentText);

        if (commentText === '' || commentText.trim().length === 0) {
            alert('cannot submit an empty comment');
            return res.redirect('/posts');
        }
        else {
            const comment = await commentData.createComment(userId, null, postId, commentText, "post");
            const post = await postData.putComment(postId, comment.commentId);
            return res.sendStatus(200);
        }

    } catch (e) {
        return res.send(400).json({success: false,
            message: e})
            // email: req.body.email})
    }

});

router
    .route('/posts/:postId/like')
    .post(async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session.user.userId;
            const userName = req.session.user.userName;
            const liked = true;
            const disliked = false;
            const postCollection = await posts();

            const result = await postData.updateLikes(postId, userId, liked,disliked);
            return res.json(result);
        } catch (e) {

            res.status(500).send(e.message);
        }
    });

router
    .route('/posts/:postId/dislike')
    .post(async (req, res) => {
        try {
            const {postId} = req.params;
            const userId = req.session.user.userId;
            const userName = req.session.user.userName;
            const liked = false;
            const disliked = true;
            //const { liked, disliked } = req.body;
            const postCollection = await posts();


            const result = await postData.updateLikes(postId, userId, liked, disliked);
            return res.json(result);

            //return res.json({ likes: result.likes, dislikes: result.dislikes });
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    });



    router.get('/search', async (req, res) => {
        try {
            const searchTerm = req.query.query;
            const searchResults = await eventsData.searchEvent(searchTerm);
            res.render('searchResults', { results: searchResults, title: 'Search Results' });
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });


router.route('/discuss').get(async (req, res) => {
    const userCollection = await users();

    var discuss = await discussData.getAllDiscussions()
    for (let x of discuss) {
        const user = await userCollection.findOne({ _id: x.userId });
        x.userName = user.userName;
        x.result = [];
        for (let y of x.replyId) {
            const user = await userCollection.findOne({ _id: y.userId });
            x.result.push({
                userName: user.userName,
                message: y.message
            });
        }
    }
    
    if(Object.keys(req.query).length!==0){
        let category=req.query.category;
        let search=req.query.search;
        category=category.toLowerCase();
        search=search.toLowerCase().trim();

        if (category && category === "all") {
            discuss = discuss.filter(d => d.description.toLowerCase().includes(search));
        } else {
            discuss = discuss.filter(d => d.category.toLowerCase() === category && d.description.toLowerCase().includes(search));
        }

    }

    return res.render('discuss', { newDiscussion: discuss, title: 'Discussion' });

});


router
    .route('/posts/:postId/allComments')
    .get(async (req, res) => {
        const postId = req.params.postId;
        const comment = await commentData.getPostCommentById(postId)
        return res.render('allComments', { comment: comment, title: 'All Comments' });
    });


router.route('/search').get(async (req, res) => {
    try {
        const searchTerm = xss(req.query.query);
        const searchResults = await eventsData.searchEvent(searchTerm);
        res.render('searchResults', { results: searchResults, title: 'Search Results' });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.route('/discuss').post(async (req, res) => {
    const userId = req.session.user.userId;
    const { category, description } = req.body;

    const discuss = await discussData.createDiscussion(category, xss(description), userId);

    const user = await userData.putDiscuss(userId, discuss._id.toString());
    return res.redirect('/discuss');
});


router.route('/discussions/:id/replies').post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const id = req.params.id;
        const { message } = req.body;
        let Message = xss(message);
        Message = validation.checkComments(Message);

        const discuss = await discussData.updateDiscussion(id, userId, Message);
        return res.sendStatus(200);
    } catch (error) {

        return res.status(500).send('An error occurred while processing the reply.');
    }
});


router.get('/searchDiscussions', async (req, res) => {
    try {
        let searchTerm = xss(req.query.query);
        const searchResults = await discussData.searchDiscussion(searchTerm);
        return res.render('discussionsResults', {results: searchResults, title: 'Discussion Results'});
    } catch (e) {
        res.status(500).json({error: 'Internal server error'});
    }
});

router
    .route('/posts/:id')
    .get(async (req, res) => {
        const post = await postData.getPostById(req.params.id);
        const deletable = (req.session.user.role === 'admin' || req.session.user.userId === post.userId.toString());
        const comments = await commentData.getPostCommentById(req.params.id);
        res.render("postEdit", {
            userId: req.session.user.userId,
            email: req.session.user.email,
            deletable: deletable,
            post: post,
            comments: comments
        });
    })
    .delete(async (req, res) => {
        try{
            const deleteEvent = await postData.getPostById(req.params.id);
            if (deleteEvent.image && deleteEvent.image !== '/images/default.jpg') {
                fs.unlink(`./public/${deleteEvent.image}`, err => {
                    if (err) {
                        throw `Error deleting image file: ${err}`;
                    }
                });
            }
            const removeComments = await commentData.removeCommentByPost(req.params.id);
            const responsePost = await postData.removePostById(req.params.id);
            if(!responsePost?.deleted || (!removeComments?.deleted && !removeComments?.empty)){
                return res.status(400).json("Unable to delete")
            }
            return res.sendStatus(200);
        } catch (e) {
            console.log(e);
        }
    });



router
    .route('/posts/:id/comment')
    .post(async (req, res) => {
        try {
            const deleteEvent = await postData.getPostById(req.params.id);
            if (deleteEvent.image !== 'images/default.jpg') {
                fs.unlink(`./public${deleteEvent.image}`, err => {
                    if (err) {
                        throw `Error deleting image file: ${err}`;
                    }
                });
            }
            const userId = req.session.user.userId;
            const postId = req.params.id.toString();
            const {commentText} = req.body;
            const comment = await commentData.createComment(userId, null, postId, commentText, "post");
            const post = await postData.putComment(postId, comment.commentId);
            return res.sendStatus(200);
        } catch (e) {
            return res.status(404);
        }
    });

router
    .route('/posts/:postId/comments/:id')
    .delete(async (req, res) => {
        try {
            const postId = req.params.postId;
            const commentId = req.params.id;
            const comments = await commentData.removeCommentById(commentId);
            if (!comments.deleteInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Fail to delete attendee or event attended list"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Comment deleted successfully"
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                success: false,
                message: "Something went wrong."
            });
        }
    });

export default router;