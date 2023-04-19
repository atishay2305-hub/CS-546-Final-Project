import Router from "express"

const router = Router();
import validation from "../validationchecker.js";
import {eventsData} from "../data/index.js"



router
    .route('/')
    // .get(async (req, res) => {
    //     let event = req.body;
    //     try {
            
    //         let eventList = await eventsData.getAllEvents();
    //         res.json(eventList);
    //     } catch (e) {
    //         res.status(500).json({error: e});
    //     }
    // })
    .post(async (req, res) => {
        let event = req.body;
        // try {
        //     event = await validation.checkPostEventConditions(event);
        // } catch (e) {
        //     res.status(400).json({error: e});
        // }
        try {
                const newEvent = await eventsData.createEvent(event.eventName, event.description, event.buildingName, event.organizer, event.seatingCapacity, event.userId)
                return res.json(newEvent)
              }
        catch (e) {
            return res.status(404).json({error: e});
        }
    });

// router
//     .route('/:id')
//     .get(async (req, res) => {
//         let id = undefined;
//         let event = undefined;
//         try {
//             id = await validation.checkEventId(req.params.id.toString());
//         } catch (e) {
//             return res.status(400).json({error: e});
//         }
//         try {
//             event = await eventsData.get(id);
//             res.status(200).json(event);
//         } catch (e) {
//             return res.status(404).json({error: e});
//         }
//     })
//     .delete(async (req, res) => {
//         let id = undefined;
//         let deletePost = undefined;
//         try{
//             id = await validation.checkEventId(req.params.id.toString());
//         }catch (e){
//             return res.status(400).json({error: e});
//         }
//         try{
//             deletePost = await eventsData.remove(id);
//             res.status(200).json(deletePost);
//         } catch (e){
//             return res.status(404).json({error: e});
//         }
//     })
//     .put(async (req, res) => {
//         let id = undefined;
//         let updatedData = req.body;
//         if(!updatedData || Object.keys(updatedData) === 0){
//             return res.status(400).json({error: `There are no fields in the request body`});
//         }
//         try{
//             id = await validation.checkEventId(req.params.id.toString());
//             updatedData = await validation.checkPostEventConditions(updatedData);
//         }catch (e){
//             return res.status(400).json({error: e});
//         }
//         try{
//             let event = await eventsData.get(id);
//         } catch (e){
//             return  res.status(404).json({error: e});
//         }
//         try{
//             const result = await eventsData.update(
//                 id,
//                 updatedData.eventName,
//                 updatedData.description,
//                 updatedData.date,
//                 updatedData.time,
//                 updatedData.location,
//                 updatedData.organizer,
//                 updatedData.attendees,
//                 updatedData.seatingCapacity,
//                 updatedData.comments
//             );
//             res.status(200).json(result);
//         }catch (e){
//             return res.status(400).json({error: e});
//         }
//     });

export default router;