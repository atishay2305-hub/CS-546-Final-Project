import express from "express";
import Router from "express";
import eventsData from "../data/events.js";
import validation from "../validationchecker.js";
import { events } from "../config/mongoCollections.js";
import multer from "multer";
const router = Router();

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "./public/images");
// //   },
// //   filename: function (req, file, cb) {
// //     const timestamp = new Date().getTime();
// //     const randomString = Math.random().toString(36).slice(2);
// //     const ext = path.extname(file.originalname);
// //     const filename = `${timestamp}-${randomString}${ext}`;
// //     cb(null, filename);
// //   },
// // });

// // const upload = multer({ storage: storage });
// // const uploadImage = upload.single("postImage");

// // router.route('/events')
// // .get(async (req, res) => {
// //   try {


// //   router.route('/events/:id').delete(async(req,res)=>{
    
// //     const response = await eventsData.removeEventById(req.params.id);
// //     //const user = await userData.removePost()
// //     //const postList = await postData.getAllPosts();
// //     //res.status(200).send(response);

// //     //res.send(response);
// //     return res.sendStatus(200);
// // });
// // router.route('/capacity/:id').post(async (req, res) => {
// //   const id = req.params.id; // fix the id variable assignment
// //   const {seatingCapacity,attendance} = req.body;
// //   let attenddone;
// //   try{
// //       let newSeatingCapacity = seatingCapacity;
      
// //       if(typeof newSeatingCapacity === 'string') {
// //         newSeatingCapacity = Number(newSeatingCapacity);
// //       }
// //       if(attendance === 'attend') {
// //         newSeatingCapacity = newSeatingCapacity - 1;
// //         attenddone = 'done';
// //       } else if(attendance === 'cancel') {
// //         newSeatingCapacity = newSeatingCapacity + 1;
// //       }
// //       var result = await eventsData.updateCapacity(
// //           id, // pass the correct id variable
// //           newSeatingCapacity,
// //       );
// //       result.forEach((node) => {
// //         node._id = node._id.toString();
// //         if(node._id === id) {
// //           node.attenddone = attenddone;
// //         }
// //       });
// //       return res.render('events', {newEvent: result});
// //   }catch (e){
// //       return res.status(400).json({error: e});
// //   }
// // });


// // router.route('/events')
// // .get(async (req, res) => {
// //   try {


// //     const events = await eventsData.getAllEvents();
// //     return res.render('events', {events: events});
// //   } catch (error) {
// //     res.status(500).json({ error: error });
// //   }
// // })
// //   .post(uploadImage, async (req, res) => {
// //     // const event = req.body;
// //     // try {
// //     //   // event.eventName = validation.checkString(event.eventName, "eventName");
// //     //   // event.description = validation.checkString(event.description, "description");
// //     //   // event.buildingName = validation.checkString(event.buildingName, "buildingName");
// //     //   // event.organizer = validation.checkString(event.organizer, "organizer");
// //     //   // event.seatingCapacity = validation.checkSeating(event.seatingCapacity, "seatingCapacity");
// //     //   // event.userId = validation.checkString(event.eventName, "userId");
// //     // } catch(error){
// //     //   return res.status(400).render('events', {error: error});
// //     // }
// //     try{
// //       // try{
// //       //   let imagePath = '';
// //       //   if (req.file) {
// //       //     imagePath = req.file.path.replace('public', '');
// //       //   } else {
// //       //     imagePath = 'images/default.jpg';
// //       //   }
// //       const {eventName, description, buildingName, organizer, seatingCapacity, userId} = req.body;
// //       const newEvent = await eventsData.createEvent(userId, eventName, description, buildingName, organizer, seatingCapacity, image);
// //       const gettingAllEvents = await eventsData.getAllEvents();
// //       return res.status(200).render('events', {newEvent: gettingAllEvents});
// //     }
// //     catch (error) {
// //       return res.status(500).json({error: error});
// //     }
// //   })

// //   router.route('/events/:id').delete(async(req,res)=>{
// //     console.log(req.params.id);
    
// //     const response = await eventsData.removeById(req.params.id);
// //     // console.log("hi",response.deleted);
// //     //const user = await userData.removePost()
// //     //const postList = await postData.getAllPosts();
// //     //res.status(200).send(response);

// //     //res.send(response);
// //     return res.sendStatus(200);
// // });
// // router.route('/capacity/:id').post(async (req, res) => {
// //   const id = req.params.id; // fix the id variable assignment
// //   const {seatingCapacity,attendance} = req.body;
// //   let attenddone;
// //   try{
// //       let newSeatingCapacity = seatingCapacity;
      
// //       if(typeof newSeatingCapacity === 'string') {
// //         newSeatingCapacity = Number(newSeatingCapacity);
// //       }
// //       if(attendance === 'attend') {
// //         newSeatingCapacity = newSeatingCapacity - 1;
// //         attenddone = 'done';
// //       } else if(attendance === 'cancel') {
// //         newSeatingCapacity = newSeatingCapacity + 1;
// //       }
// //       console.log(req.session);
// //       var result = await eventsData.updateCapacity(
// //           id, // pass the correct id variable
// //           newSeatingCapacity,
// //     
// //           "644832c015500e1f645fcfed"
// //       );
// //       result.forEach((node) => {
// //         node._id = node._id.toString();
// //         if(node._id === id) {
// //           node.attenddone = attenddone;
// //         }
// //       });
// //       return res.render('events', {newEvent: result});
// //   }catch (e){
// //       console.log(e);
// //       return res.status(400).json({error: e});
// //   }
// // });



// // // router
// // //     .route('/:id')
// // //     .get(async (req, res) => {
// // //         let id = undefined;
// // //         let event = undefined;
// // //         try {
// // //             id = await validation.checkId(req.params.id.toString());
// // //         } catch (e) {
// // //             return res.status(400).json({error: e});
// // //         }
// // //         try {
// // //             event = await eventsData.getEventByID(id);
// // //             res.status(200).json(event);
// // //         } catch (e) {
// // //             return res.status(404).json({error: e});
// // //         }
// // //     })
// // //     .delete(async (req, res) => {
// // //         let id = req.params.id;
// // //         let deletePost = undefined;
// // //         try{
// // //             id = await validation.checkId(req.params.id.toString());
// // //         }catch (e){
// // //             return res.status(400).json({error: e});
// // //         }
// // //         try{
// // //             deletePost = await eventsData.removeEventById(id);
// // //             res.status(200).json(deletePost);
// // //         } catch (e){
// // //             return res.status(404).json({error: e});
// // //         }
// // //     })
// // // .put(async (req, res) => {
// // //   let id = req.params.id; // fix the id variable assignment
// // //   let updatedData = req.body;
// // //   if(!updatedData || Object.keys(updatedData).length === 0){ // fix the condition to check for empty object
// // //       return res.status(400).json({error: `There are no fields in the request body`});
// // //   }
// // //   try{
// // //       id = validation.checkId(id); // fix the variable name and pass the correct id variable
// // //       updatedData = validation.checkPostEventConditions(updatedData);
// // //       updatedData.eventName = validation.checkString(updatedData.eventName, "eventName");
// // //       updatedData.description = validation.checkString(updatedData.description, "description");
// // //       updatedData.buildingName = validation.checkString(updatedData.buildingName, "buildingName");
// // //       updatedData.organizer = validation.checkString(updatedData.organizer, "organizer"); // fix the commented line
// // //       updatedData.seatingCapacity = validation.checkSeating(updatedData.seatingCapacity, "seatingCapacity");
// // //       updatedData.userId = validation.checkString(updatedData.userId, "userId"); // fix the variable name
// // //   }catch (e){
// // //       return res.status(400).json({error: e});
// // //   }
// // //   try{
// // //       let event = await eventsData.getEventByID(id);
// // //   } catch (e){
// // //       return  res.status(404).json({error: e});
// // //   }
// // //   try{
// // //       const result = await eventsData.updateEvent(
// // //           id, // pass the correct id variable
// // //           updatedData.eventName,
// // //           updatedData.description,
// // //           updatedData.buildingName,
// // //           updatedData.organizer,
// // //           updatedData.seatingCapacity,
// // //           updatedData.userId
// // //       );
// // //       res.status(200).json(result);
// // //   }catch (e){
// // //       return res.status(400).json({error: e});
// // //   }
// // // });

// import {Router} from 'express';
// import commentData from '../data/comments.js';
// import userData from '../data/users.js';
// import postData from '../data/posts.js';
// import eventsData from '../data/index.js'
// import validation from '../validationchecker.js';
// import multer from "multer";
// import path from "path";
// import {passwordResetByEmail} from "../email.js";
// import xss from 'xss';
// import {comments, users, posts} from '../config/mongoCollections.js';
// import {ObjectId} from 'mongodb';
// const router = Router();


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/images");
//     },
//     filename: function (req, file, cb) {
//         const timestamp = new Date().getTime();
//         const randomString = Math.random().toString(36).slice(2);
//         const ext = path.extname(file.originalname);
//         const filename = `${timestamp}-${randomString}${ext}`;
//         cb(null, filename);
//     },
// });

// const upload = multer({storage: storage});
// const uploadImage = upload.single("postImage");
// router
//     .route('/events')
//     .get(async (req, res) => {
//         if(req.session.user) {
//             let events = await eventsData.getAllEvents();
//             events = events.map(event => {
//                 return {...event, _id: event._id.toString()};
//             });
//             const geComments = events.map(event => commentData.getEventCommentById(event._id.toString()));
//             const allComment = await Promise.all(geComments);
//             const comments = allComment.reduce((acc, comment, index) => {
//                 const eventId = events[index]._id.toString();
//                 if (acc[eventId]) {
//                     acc[eventId].push(comment);
//                 } else {
//                     acc[eventId] = [comment];
//                 }
//                 return acc;
//             }, {});
//             Object.values(comments).forEach(commentArr => {
//                 commentArr.sort((a, b) => b.created_Date - a.created_Date);
//             });
//         }``
//         return res.render('events', {role: req.session.role, events: events, comments: comments});
//     })
//     .post(uploadImage, async (req, res) => {
//         const id = req.session.user.userId;
//         const userName = req.session.user.userName;
//         const role = req.session.user.role;
//         if (role === 'user') {
//             return res.status(401).json({
//                 success: false,
//                 message: "Event cannot generate by user"
//             });
//         }
//         let eventName = xss(req.body.eventName);
//         let description = xss(req.body.description);
//         let buildingName = xss(req.body.buildingName);
//         let organizer = xss(req.body.organizer);
//         let seatingCapacity = xss(req.body.seatingCapacity);
//         try {
//             let imagePath;
//             if (req.file) {
//                 imagePath = req.file.path.replace('public', '');
//             } else {
//                 imagePath = 'images/default.jpg';
//             }
//             const event = await eventsData.createEvent(eventName, description, buildingName, organizer, seatingCapacity, imagePath);
//             const user = await userData.putEvent(id, event._id);
//             return res.redirect('/events');
//         } catch (e) {
//             return res.status(400).json({
//                 success: false,
//                 eventName: req.body.eventName,
//                 description: req.body.description,
//                 buildingName: req.body.buildingName,
//                 organizer: req.body.organizer,
//                 seatingCapacity: req.body.seatingCapacity
//             })
//         }
//     });


 export default router;

