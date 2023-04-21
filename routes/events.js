import Router from "express";
import { eventsData } from "../data/index.js";
import validation from "../validationchecker.js";

const router = Router();

router
  .get('/create-event', (req, res) => {
    res.render('events');
  })
  .post('/create-event', (req, res) => {
    res.render('events');
  })
  .get('/search-events', (req, res) => {
    const searchBy = req.query.searchBy;
    let events = [];

    if (searchBy === "id") {
      const id = req.query.id;
    }

    if (searchBy === "buildingName") {
      const buildingName = req.query.buildingName;
    }

    if (searchBy === "eventName") {
      const eventName = req.query.eventName;
    }

    if (searchBy === "organizer") {
      const organizer = req.query.organizer;
    }

    res.render('search-events', {
      events: events
    });
  })
  .get('/remove-event', (req, res) => {
    res.render('removeEvents');
  })
  .post('/remove-event', (req, res) => {
    const id = req.body.id;
    res.redirect('/remove-event');
  })
  .get('/update-event', (req, res) => {
    res.render('update-event');
  })
  .post('/update-event', (req, res) => {
    const id = req.body.id;
    const eventName = req.body.eventName;
    const description = req.body.description;
    const buildingName = req.body.buildingName;
    const organizer = req.body.organizer;
    const seatingCapacity = req.body.seatingCapacity;
    res.redirect('/update-event');
  });

router
  .route('/')
  .get(async (req, res) => {
    try {
      const eventList = await eventsData.getAllEvents();
      res.json(eventList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const event = req.body;
    try {
      // Validate the event object before creating it
      const validatedEvent = await validation.checkPostEventConditions(event);
      const newEvent = await eventsData.createEvent(validatedEvent.eventName, validatedEvent.description, validatedEvent.buildingName, validatedEvent.organizer, validatedEvent.seatingCapacity, validatedEvent.userId);
}
catch (e) {
            return res.status(404).json({error: e});
        }
    });

router
    .route('/:id')
    .get(async (req, res) => {
        let id = undefined;
        let event = undefined;
        try {
            id = await validation.checkEventId(req.params.id.toString());
        } catch (e) {
            return res.status(400).json({error: e});
        }
        try {
            event = await eventsData.get(id);
            res.status(200).json(event);
        } catch (e) {
            return res.status(404).json({error: e});
        }
    })
    .delete(async (req, res) => {
        let id = undefined;
        let deletePost = undefined;
        try{
            id = await validation.checkEventId(req.params.id.toString());
        }catch (e){
            return res.status(400).json({error: e});
        }
        try{
            deletePost = await eventsData.remove(id);
            res.status(200).json(deletePost);
        } catch (e){
            return res.status(404).json({error: e});
        }
    })
    .put(async (req, res) => {
        let id = undefined;
        let updatedData = req.body;
        if(!updatedData || Object.keys(updatedData) === 0){
            return res.status(400).json({error: `There are no fields in the request body`});
        }
        try{
            id = await validation.checkEventId(req.params.id.toString());
            updatedData = await validation.checkPostEventConditions(updatedData);
        }catch (e){
            return res.status(400).json({error: e});
        }
        try{
            let event = await eventsData.get(id);
        } catch (e){
            return  res.status(404).json({error: e});
        }
        try{
            const result = await eventsData.update(
                id,
                updatedData.eventName,
                updatedData.description,
                updatedData.date,
                updatedData.time,
                updatedData.location,
                updatedData.organizer,
                updatedData.attendees,
                updatedData.seatingCapacity,
                updatedData.comments
            );
            res.status(200).json(result);
        }catch (e){
            return res.status(400).json({error: e});
        }
    });

export default router;