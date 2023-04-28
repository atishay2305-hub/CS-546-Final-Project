import express from "express";
import Router from "express";
import eventsData from "../data/events.js";
import validation from "../validationchecker.js";
import { events } from "../config/mongoCollections.js";
const router = Router();


router.route('/events')
.get(async (req, res) => {
  try {
    const events = await eventsData.getAllEvents();
    return res.render('events', {events: events});
  } catch (error) {
    res.status(500).json({ error: error });
  }
})
  .post(async (req, res) => {

    try{
      const {eventName, description, buildingName, organizer, seatingCapacity, userId} = req.body;
      console.log({eventName, description, buildingName, organizer, seatingCapacity, userId})
      const newEvent = await eventsData.createEvent(userId, eventName, description, buildingName, organizer, seatingCapacity);
      // console.log(newEvent);
      // console.log("here")
      const gettingAllEvents = await eventsData.getAllEvents();
      console.log(gettingAllEvents)
      return res.status(200).render('events', {newEvent: gettingAllEvents});
    }
    catch (error) {
      return res.status(500).json({error: error});
    }
  });
  


// router
//     .route('/:id')
//     .get(async (req, res) => {
//         let id = undefined;
//         let event = undefined;
//         try {
//             id = await validation.checkId(req.params.id.toString());
//         } catch (e) {
//             return res.status(400).json({error: e});
//         }
//         try {
//             event = await eventsData.getEventByID(id);
//             res.status(200).json(event);
//         } catch (e) {
//             return res.status(404).json({error: e});
//         }
//     })
//     .delete(async (req, res) => {
//         let id = req.params.id;
//         let deletePost = undefined;
//         try{
//             id = await validation.checkId(req.params.id.toString());
//         }catch (e){
//             return res.status(400).json({error: e});
//         }
//         try{
//             deletePost = await eventsData.removeEventById(id);
//             res.status(200).json(deletePost);
//         } catch (e){
//             return res.status(404).json({error: e});
//         }
//     })
// .put(async (req, res) => {
//   let id = req.params.id; // fix the id variable assignment
//   let updatedData = req.body;
//   if(!updatedData || Object.keys(updatedData).length === 0){ // fix the condition to check for empty object
//       return res.status(400).json({error: `There are no fields in the request body`});
//   }
//   try{
//       id = validation.checkId(id); // fix the variable name and pass the correct id variable
//       updatedData = validation.checkPostEventConditions(updatedData);
//       updatedData.eventName = validation.checkString(updatedData.eventName, "eventName");
//       updatedData.description = validation.checkString(updatedData.description, "description");
//       updatedData.buildingName = validation.checkString(updatedData.buildingName, "buildingName");
//       updatedData.organizer = validation.checkString(updatedData.organizer, "organizer"); // fix the commented line
//       updatedData.seatingCapacity = validation.checkSeating(updatedData.seatingCapacity, "seatingCapacity");
//       updatedData.userId = validation.checkString(updatedData.userId, "userId"); // fix the variable name
//   }catch (e){
//       return res.status(400).json({error: e});
//   }
//   try{
//       let event = await eventsData.getEventByID(id);
//   } catch (e){
//       return  res.status(404).json({error: e});
//   }
//   try{
//       const result = await eventsData.updateEvent(
//           id, // pass the correct id variable
//           updatedData.eventName,
//           updatedData.description,
//           updatedData.buildingName,
//           updatedData.organizer,
//           updatedData.seatingCapacity,
//           updatedData.userId
//       );
//       res.status(200).json(result);
//   }catch (e){
//       return res.status(400).json({error: e});
//   }
// });


export default router;