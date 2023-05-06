import {Router} from 'express';
import commentData from '../data/comments.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import discussData from '../data/discussion.js'
import eventsData from '../data/events.js'
import validation from '../validationchecker.js';
import multer from "multer";
import path from "path";
import bcrypt from 'bcrypt';
import {passwordResetByEmail} from "../email.js";
import xss from 'xss';
import {comments, users, posts} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import { title } from 'process';
import { error } from 'console';


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

const upload = multer({storage: storage});
const uploadImage = upload.single("postImage");



router.route('/').get(async (req, res) => {

    if (req.session.user) {
        return res.status(200).redirect('/homepage');
    } else {
        return res.status(200).render('login', {title: 'Login'});
    }
});
router
    .route('/login')
    .get(async (req, res) => {
        try {
            return res.render("login", {title: 'Login'});
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

        return res.status(200).render('register', {title: "Register Page"});
    })
    .post(async (req, res) => {


        try {
            // removed dept

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
            const existingUser = await userCollection.findOne({email: email});
            if (existingUser) {
                return res.status(401).json({
                    success: false,
                    message: "either username or email already exists."
                });
            }
            if (role === 'admin') {
                let authentication = xss(req.body.authentication);
                user = await userData.createUser(firstName, lastName, userName, email, password, DOB, role, department, authentication);
            } else {
                user = await userData.createUser(firstName, lastName, userName, email, password, DOB, role, department);
            }
            const date = validation.getDate();

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
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
                dateOfBirth: req.body.dateOfBirth,
                error: e,
            })
        }
    });

router.route('/homepage').get(async (req, res) => {
    const userId = req.session.user.userId;

    console.log(userId);

    // console.log(userId)
    //const email = req.session.email;
    //useremail from session and will just keep it

    //const user = await userData.getUserByID(userId);
    //const postList = await userData.getPostList(user.email);

    //user info from ID
    //getpost list if true
    const userName = req.session.user.userName;
    // console.log(userName);
    //console.log(postList);
    const postList = await postData.getAllPosts();
    // console.log(postList);
    //
    //console.log(postList);
    for (let x of postList) {
        let resId = x?.userId;

        let resString = resId.toString();

        const user = await userData.getUserByID(resString);
        x.name = user.userName;
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
        title: 'Homepage'
    });

});


router.route('/profile').get(async(req,res)=> {
    const id = req.session.user.userId;
    const user = await userData.getUserByID(id);
    return res.render('profile',{user:user, title: 'Profile Page'});
});


router.route('/posts')
    .get(async (req, res) => {
        // Retrieve posts and comments
        let posts = await postData.getAllPosts();
        posts = posts.map(post => {
            return {...post, _id: post._id.toString()};
        });
        const getComments = posts.map(post => commentData.getPostCommentById(post._id.toString()));
        const allComment = await Promise.all(getComments);

        // Separate comments by postId
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

        // Render the 'posts' template with posts and commentsByPostId

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
                imagePath = 'images/default.jpg';
            }

            if (category === 'lost&found') {
                address = xss(req.body.address);
                address = validation.checkAddress(address);
            }
            const post = await postData.createPost(category, imagePath, postContent, userName, address);
            const user = await userData.putPost(id, post._id);


            console.log("The post is posted");
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

    // console.log(id);

    const user = await userData.getUserByID(id);
    return res.render('profile', {user: user, title: 'Profile'});
});


router.route('/posts/:id').delete(async (req, res) => {
    // console.log(req.params.id);
    try {
        const user = await userData.getUserByID(req.session.user.userId);
        if (!user) {
            throw 'cannot find user';
        }
        //console.log(user);
        const commentCollection = await comments();
        const post = await commentCollection.find({postId: new ObjectId(req.params.id)}).toArray();
        // console.log(post);
        if (post.length !== 0) {
            const responsePost = await commentData.removeCommentByPost(req.params.id);
        }
        const response = await postData.removeById(req.params.id);
        // console.log("hi", response.deleted);
        //const user = await userData.removePost()
        //const postList = await postData.getAllPosts();
        //res.status(200).send(response);
        //res.send(response);
        return res.sendStatus(200);
    } catch (e
        ) {
        console.log(e);
    }
});

router.route('/posts/:id/comment').post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const postId = req.params.id;
        const {commentText} = req.body;
        // console.log(postId);
        // console.log(commentText);
        const comment = await commentData.createComment(userId, null, postId, commentText, "post");
        console.log(comment);
        const post = await postData.putComment(postId, comment.commentId);
        // console.log(post);
        console.log('The comment is added');
        return res.redirect('/posts');
    } catch (e) {
        console.log(e);
    }

});

// router.route('').delete(async (req, res) => {
//     //console.log(req.params.id);
//     console.log("entered delete event route");
//     try {
//         const user = await userData.getUserByID(req.session.user.userId);
//         if (!user) {
//             throw 'cannot find user';
//         }
//         if (user.role !== 'admin') throw "Only administrators can delete events.";


//         const commentCollection = await comments();
//         const event = await commentCollection.find({eventId: new ObjectId(req.params.id)}).toArray();
//         if (event.length !== 0) {
//             const response = await commentData.removeCommentByEvent(req.params.id);
//             console.log("hi", response.deleted);
//         }
//         if (!event) {
//             throw "No events found!!"
//         }

//         const responseEvent = await eventsData.removeEventById(req.params.id);


//         // console.log("hi", responseEvent.deleted);





// router.route('/logout')
//   .get(async (req, res) => {
//     if (req.cookies.AuthCookie) {
//       res.clearCookie('AuthCookie');
//     }
//     res.redirect('/');
//   });

// router.route('/add-comment').post(async(req,res)=>{


router
    .route('/reset-password/:id')
    .get(async (req, res) => {
        try {
            return res.render('resetPassword', {id: req.params.id, title: 'Reset Password'})
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
            return res.status(400).render("/resetPassword", {
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
            return res.render('changePassword', {id: req.params.id, title: 'Change Password'})
        } catch (e) {
            return res.status(404).sendFile(path.resolve("public/static/404.html"));

        }
    })
    .post(async (req, res) => {
        try {
          
            let id = xss(req.params.id);
            let newPassword = xss(req.body.newPassword);
            let oldPassword = xss(req.body.oldPassword);
            console.log(id);
            id = validation.checkId(id);
          
            newPassword = validation.checkPassword(newPassword);
            oldPassword = validation.checkPassword(oldPassword);
            const user=await userData.getUserByID(id);
            
            const passwordMatch = await bcrypt.compare(oldPassword,user.password);
            if(passwordMatch){
                
                const passwordUpdate = await userData.updatePassword(id, newPassword);
            }else{
                res.status(400).render("changePassword",{error:"Password did not match"});
            }
            // let result = validation.checkIdentify(newPassword, confirmNewPassword);
            // if (result) {
            //     const passwordUpdate = await userData.updatePassword(id, newPassword);
            // }
            res.redirect('/logout');
        } catch (e) {
            console.log(e);
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
            return res.render("forgotPassword", {title: 'Forgot Password'});
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

    router.use('/logout', (req, res) => {
        if (!req.session.user) {
            return res.render('login', {title: 'Login'});
        }
        req.session.destroy();
        return res.render('logout', {title: 'logout'});
    });

router.route('/profile').get(async (req, res) => {
    const id = req.session.user.userId;

    const user = await userData.getUserByID(id);
    return res.render('profile', {user: user});
});



router.route('/posts/:id').delete(async (req, res) => {
    try{
        const user = await userData.getUserByID(req.session.user.userId);
        if(!user){
            throw 'cannot find user';
        }
        const commentCollection = await comments();
        const post = await commentCollection.find({postId:new ObjectId(req.params.id)}).toArray();
        if(post.length !== 0){
            const responsePost = await commentData.removeCommentByPost(req.params.id);
            console.log("hi",responsePost.deleted);
        }
        const response = await postData.removeById(req.params.id);
        //const user = await userData.removePost()
        //const postList = await postData.getAllPosts();
        //res.status(200).send(response);
        //res.send(response);
        return res.sendStatus(200);
    } catch(e)
    {
        return res.status(404).json({ error: 'Resource not found' });
    }
});

router.route('/posts/:id/comment').post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        let postId = req.params.id;
        let {commentText} = req.body;
        commentText = validation.checkPhrases(commentText);
        const comment = await commentData.createComment(userId, null, postId, commentText, "post");
        const post = await postData.putComment(postId, comment.commentId);
        return res.redirect('/posts');
    } catch (e) {
        // return res.sendStatus(404)
        console.log(e)
        // return res.render('error', {error: 'Either the comment is empty or we could not add it'});
    }
});

router
    .route('/posts/:postId/like')
    .post(async (req, res) => {
        try {
            const {postId} = req.params;
            const {liked, disliked} = req.body;

            const result = await postData.updateLikes(postId, liked, disliked);
            if (typeof localStorage !== 'undefined') {
                const storageKey = `post-${postId}-state`;
                const localStorageValue = localStorage.getItem(storageKey);
                const parsedValue = localStorageValue ? JSON.parse(localStorageValue) : {liked: false, disliked: false};
                parsedValue.liked = liked;
                parsedValue.disliked = false;
                localStorage.setItem(storageKey, JSON.stringify(parsedValue));
            }

            return res.json({likes: result.likes, dislikes: result.dislikes});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server error'});

        }
    });

router
    .route('/posts/:postId/dislike')
    .post(async (req, res) => {
        try {
            const {postId} = req.params;
            const {liked, disliked} = req.body;

            // Update the dislike status in the server-side storage
            const result = await postData.updateDisLikes(postId, liked, disliked);

            const storageKey = `post-${postId}-state`;
            const localStorageValue = localStorage.getItem(storageKey);
            const parsedValue = localStorageValue ? JSON.parse(localStorageValue) : {liked: false, disliked: false};
            parsedValue.liked = false;
            parsedValue.disliked = disliked;
            localStorage.setItem(storageKey, JSON.stringify(parsedValue));

            return res.json({likes: result.likes, dislikes: result.dislikes});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server error'});
        }
    });

router
    .route('/search')
    .get(async (req, res) => {
        try {
            const searchTerm = req.query.query;
            const searchResults = await eventsData.searchEvent(searchTerm);
            res.render('searchResults', {results: searchResults, title: 'Search Results'});
        } catch (e) {
            res.status(500).json({error: 'Internal server error'});
        }
    });

router.route('/discuss').get(async (req, res) => {
    const userCollection = await users();

    const discuss = await discussData.getAllDiscussions();
    for (let x of discuss) {
        const user = await userCollection.findOne({_id: x.userId});
        x.userName = user.userName;
        x.result = [];
        for (let y of x.replyId) {
            const user = await userCollection.findOne({_id: y.userId});
            x.result.push({
                userName: user.userName,
                message: y.message
            });
        }
    }

    return res.render('discuss', {newDiscussion: discuss, title: 'Discussion'});

});



router
    .route('/posts/:postId/allComments')
    .get(async (req, res) => {
        const postId = req.params.postId;
        const comment = await commentData.getPostCommentById(postId)
        return res.render('allComments', {comment: comment, title: 'All Comments'});
    });



    // const discuss = await discussData.createDiscussion(category, description, userId);
    // return res.redirect('/discuss');
    // //return res.status(200).render('discuss', { newDiscussion: discuss });


router.route('/search').get(async (req, res) => {
  try {
    const searchTerm = xss(req.query.query); 
    const searchResults = await eventsData.searchEvent(searchTerm);
    res.render('searchResults', { results: searchResults, title: 'Search Results' });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.route('/discuss').get(async (req, res) => {
  const userCollection = await users();
  const dbQuery = {};
  if (req.query?.category && req.query.category !== 'All') {
    dbQuery.category = req.query.category;
  }

  if (req.query?.search) {
    dbQuery.description = { $regex: xss(req.query.search), $options: 'i' }; 
  }

  const discuss = await discussData.getAllDiscussions(dbQuery);
  for (let x of discuss) {
    const user = await userCollection.findOne({ _id: x.userId });
    x.userName = user.userName;
    x.result = [];
    for (let y of x.replyId) {
      const user = await userCollection.findOne({ _id: y.userId });
      x.result.push({
        userName: user.userName,
        message: y.message,
      });
    }
  }

  return res.render('discuss', { newDiscussion: discuss, title: 'Discussion' });
});

router.route('/discuss').post(async (req, res) => {
  const userId = req.session.user.userId;
//   description = validation.checkPhrases(description);
// category = validation.checkCategory()
  const { category, description } = req.body;

  const discuss = await discussData.createDiscussion(category, xss(description), userId); 
  return res.redirect('/discuss');
});


router.route('/discussions/:id/replies').post(async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const id = req.params.id;
      const { message } = req.body;
      const Message = xss(message);
      Message = validation.checkPhrases(Message);
  
      if (Message.length > 300) {
        return res.status(400).send('Reply exceeds the maximum character limit of 300.');
      }
  
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
        return res.render('discussionsResults', { results: searchResults, title: 'Discussion Results' });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
    });

export default router;