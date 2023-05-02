// import express from "express";
// import Router from "express";
// import eventsData from "../data/events.js";
// import validation from "../validationchecker.js";
// import { events } from "../config/mongoCollections.js";
// import multer from "multer";
// import path from "path";
// const router = Router();
// import userData from "../data/users.js";



// router.route('/').get(async (req, res) => {
//   try {
    
//   const userId = req.session.userId;
//   if (!userId) {
//       throw new Error('User ID not found in session');
//   }
    
//     //const userCollection = await users();
//     const user = await userData.getUserByID(userId);
//     console.log('The user is ',user);

//     if(!user){
//         throw new Error('No user found');
//     }

//     console.log("hello bro!!",userId);
    

//     const events = await eventsData.getAllEvents();

//     for (let x of events){

//       let resId = x?.userId;        
//       let resString= resId.toString();

//       const user = await userData.getUserByID(resString);
//       x.name =user.userName;
//       //console.log(user.userName);
//       //console.log(resString);
//       //console.log(x.userName);
//       if(resString === userId){
//           x.editable =true;
//           x.deletable = true;
//       }else{
//           x.editable = false;
//           x.deletable = false;
//       }
//   }


//     return res.render('events', {newEvent: events});
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }
// });


// const eventStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images");
//   },
//   filename: function (req, file, cb) {

//     const timestamp = new Date().getTime();
//     const randomString = Math.random().toString(36).slice(2);
//     const ext = path.extname(file.originalname);
//     const filename = `${timestamp}-${randomString}${ext}`;
//     cb(null, filename);
//   },
// });


// const eventUpload = multer({ storage: eventStorage });
// const eventUploadImage = eventUpload.single("postImage");




// router.route('/').post(eventUploadImage, async (req, res) => {

//   const userId = req.session.userId;
//   console.log(userId);
//   try{
//       let imagePath = '';
//       if (req.file) {
//         imagePath = req.file.path.replace('public', '');
//       } else {
//         imagePath = 'images/default.jpg';
//       }
//     const {eventName, description, buildingName, organizer, seatingCapacity} = req.body;
//     const newEvent = await eventsData.createEvent(userId, eventName, description, buildingName, organizer, seatingCapacity, imagePath, req);
//     // console.log(newEvent)
//     const gettingAllEvents = await eventsData.getAllEvents();

//     for (let x of gettingAllEvents){

//       let resId = x?.userId;        
//       let resString= resId.toString();

//       const user = await userData.getUserByID(resString);
//       x.name =user.userName;
//       //console.log(user.userName);
//       //console.log(resString);
//       //console.log(x.userName);
//       if(resString === userId){
//           x.editable =true;
//           x.deletable = true;
//       }else{
//           x.editable = false;
//           x.deletable = false;
//       }
//   }

//     return res.status(200).render('events', {newEvent: gettingAllEvents});
//   }
//   catch (error) {
//     console.log(error);
//     return res.status(500).json({error: error});
//   }
// });


//   router.route('/:id').delete(async(req,res)=>{
//     console.log(req.params.id);
    
//     const response = await eventsData.removeEventById(req.params.id);
//     // console.log("hi",response.deleted);
//     //const user = await userData.removePost()
//     //const postList = await postData.getAllPosts();
//     //res.status(200).send(response);

//     //res.send(response);
//     return res.sendStatus(200);
// });


// // router
// //     .route('/:id')
// //     .get(async (req, res) => {
// //         let id = undefined;
// //         let event = undefined;
// //         try {
// //             id = await validation.checkId(req.params.id.toString());
// //         } catch (e) {
// //             return res.status(400).json({error: e});
// //         }
// //         try {
// //             event = await eventsData.getEventByID(id);
// //             res.status(200).json(event);
// //         } catch (e) {
// //             return res.status(404).json({error: e});
// //         }
// //     })
// //     .delete(async (req, res) => {
// //         let id = req.params.id;
// //         let deletePost = undefined;
// //         try{
// //             id = await validation.checkId(req.params.id.toString());
// //         }catch (e){
// //             return res.status(400).json({error: e});
// //         }
// //         try{
// //             deletePost = await eventsData.removeEventById(id);
// //             res.status(200).json(deletePost);
// //         } catch (e){
// //             return res.status(404).json({error: e});
// //         }
// //     })
// // .put(async (req, res) => {
// //   let id = req.params.id; // fix the id variable assignment
// //   let updatedData = req.body;
// //   if(!updatedData || Object.keys(updatedData).length === 0){ // fix the condition to check for empty object
// //       return res.status(400).json({error: `There are no fields in the request body`});
// //   }
// //   try{
// //       id = validation.checkId(id); // fix the variable name and pass the correct id variable
// //       updatedData = validation.checkPostEventConditions(updatedData);
// //       updatedData.eventName = validation.checkString(updatedData.eventName, "eventName");
// //       updatedData.description = validation.checkString(updatedData.description, "description");
// //       updatedData.buildingName = validation.checkString(updatedData.buildingName, "buildingName");
// //       updatedData.organizer = validation.checkString(updatedData.organizer, "organizer"); // fix the commented line
// //       updatedData.seatingCapacity = validation.checkSeating(updatedData.seatingCapacity, "seatingCapacity");
// //       updatedData.userId = validation.checkString(updatedData.userId, "userId"); // fix the variable name
// //   }catch (e){
// //       return res.status(400).json({error: e});
// //   }
// //   try{
// //       let event = await eventsData.getEventByID(id);
// //   } catch (e){
// //       return  res.status(404).json({error: e});
// //   }
// //   try{
// //       const result = await eventsData.updateEvent(
// //           id, // pass the correct id variable
// //           updatedData.eventName,
// //           updatedData.description,
// //           updatedData.buildingName,
// //           updatedData.organizer,
// //           updatedData.seatingCapacity,
// //           updatedData.userId
// //       );
// //       res.status(200).json(result);
// //   }catch (e){
// //       return res.status(400).json({error: e});
// //   }
// // });


// export default router;