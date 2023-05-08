import {Router} from 'express';
import commentData from '../data/comments.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import eventsData from '../data/events.js'
import validation from '../validationchecker.js';
import multer from "multer";
import path from "path";
import {registrationConfirmByEmail} from "../email.js";
import xss from 'xss';
import {comments, users, posts, events} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import { title } from 'process';

const router = Router();

const eventStorage = multer.diskStorage({
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

const eventUpload = multer({storage: eventStorage});
const eventUploadImage = eventUpload.single("eventImage");


router
    .route('/')
    .get(async (req, res) => {
        let events = []; // Declare and initialize events variable

        if (req.session.user) {
            events = await eventsData.getAllEvents();

            events = events.map(event => {
                const attendeeList = Object.values(event.attendees).map(attendee => ({userId: attendee.id.toString(), name: attendee.name}));
                const registered = attendeeList.some(attendee => attendee.userId === req.session.user.userId.toString());
                return {
                    ...event,
                    _id: event._id.toString(),
                    attendees: attendeeList,
                    registered: registered
                };
            });

            const getComments = events.map(event =>
                commentData.getEventCommentById(event._id.toString())
            );
            const allComments = await Promise.all(getComments);

            const comments = allComments.reduce((acc, comment, index) => {
                const eventId = events[index]._id.toString();
                if (acc[eventId]) {
                    acc[eventId].push(comment);
                } else {
                    acc[eventId] = [comment];
                }
                return acc;
            }, {});

            Object.values(comments).forEach(commentArr => {
                commentArr.sort((a, b) => b.created_Date - a.created_Date);
            });

            return res.render('events', {
                userId: req.session.user.userId,
                email: req.session.user.email,
                role: req.session.user.role,
                events: events,
                comments: comments,
                title: 'Events'
            });
        }
    })
    .post(eventUploadImage, async (req, res) => {
        const userId = req.session.user.userId;
        const role = req.session.user.role;
        if (role === 'user') {
            return res.status(401).json({
                success: false,
                message: "Event cannot generate by user"
            });
        }
        let eventName = xss(req.body.eventName);
        let description = xss(req.body.description);
        let date = xss(req.body.date);
        let buildingName = xss(req.body.buildingName);
        let roomNumber = xss(req.body.roomNumber);
        let organizer = xss(req.body.organizer);
        let seatingCapacity = xss(req.body.seatingCapacity);
        try {
            let imagePath;
            if (req.file) {
                imagePath = req.file.path.replace('public', '');
            } else {
                imagePath = 'images/default.jpg';
            }

            const event = await eventsData.createEvent(eventName, description, date, buildingName, roomNumber, organizer, seatingCapacity, userId, imagePath);
            const user = await userData.putEvent(userId, event._id.toString());
            return res.redirect('/events');
        } catch (e) {
            return res.status(400).json({
                success: false,
                eventName: req.body.eventName,
                description: req.body.description,
                date: req.body.date,
                buildingName: req.body.buildingName,
                roomNumber: req.body.roomNumber,
                organizer: req.body.organizer,
                seatingCapacity: req.body.seatingCapacity
            })
        }
    });

router
    .route('/:id/comment')
    .post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const eventId = req.params.id;
        const {commentText} = req.body;

        const comment = await commentData.createComment(userId, eventId, null, commentText, "event");
        const post = await eventsData.putComment(eventId, comment.commentId);

        console.log('The comment is added');
        return res.redirect("/events")
    } catch (e) {
        console.log(e);
        return res.json({success: false, message: e.message});
    }
});

router
    .route('/event-register')
    .post(async (req, res) => {
        try {
            let email = xss(req.body.email);
            email = validation.checkEmail(email);
            let userId = xss(req.body.userId);
            userId = validation.checkId(userId);
            const user = await userData.getUserByID(userId);
            let eventId = xss(req.body.eventId)
            eventId = validation.checkId(eventId);
            const event = await eventsData.getEventByID(eventId);
            const attendeesList = event.attendees;
            const checkExist = attendeesList.length > 0 && Object.values(attendeesList).some(attendee => attendee.id === userId);
            if (!checkExist) {
                // user not already registered
                await registrationConfirmByEmail({id: eventId, email: email}, res);
            } else {
                // user already registered
                return res.status(400).json({
                    success: false,
                    message: "You have already registered for this event."
                });
            }
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong. Please try again later."
            });
        }
    });

router
    .route('/:eventId/attendees/:id')
    .delete(async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.params.id;
        const user = await userData.getUserByID(userId);
        const event = await eventsData.getEventByID(eventId);
        const attendees = await userData.removeAttendee(user._id, eventId);
        const eventAttended = await userData.removeEventAttended(user._id, eventId);
        if (!attendees.deleteInfo || !eventAttended) {
            return res.status(404).json({
                success: false,
                message: "Fail to delete attendee or event attended list"
            });
        }
        return res.json({success: true, message: "Cancel successful"})
    } catch (e) {
        console.log(e);
        res.sendStatus(500).json({
                success: false,
                message: "Something went wrong."
        });
    }
});

router
    .route("/registration/confirm/:id")
    .get(async (req, res) => {

        const eventId = req.params.id;
        const event = await eventsData.getEventByID(eventId);
        if (!event) {
            return res.status(404).render("error", {message: "Event not found"});
        }
        res.render("eventRegister", {eventId: eventId});
    })
    .post(async (req, res) => {
        try {
            let eventId = xss(req.body.eventId);
            let email = xss(req.body.email);
            const event = await eventsData.getEventByID(eventId);
            const user = await userData.getUserByEmail(email);
            const attendees = await userData.putAttendee(user._id, eventId);
            const eventAttended = await userData.putEventAttended(user._id, eventId);

            if (!attendees.updateInfo || !eventAttended) {
                return res.status(404).json({
                    success: false,
                    message: "Fail to update attendee or event attended list"
                });
            }

            return res.redirect('/homepage')
        } catch (e) {
            console.log(e);
            return res.status(500).json({success: false, message: "Server error"});
        }
    });

router.route('/events/:id').delete(async (req, res) => {
    //console.log(req.params.id);
    try {
        const user = await userData.getUserByID(req.session.user.userId);
        const commentCollection = await comments();
        const event = await commentCollection.find({eventId: new ObjectId(req.params.id)}).toArray();
        if (event.length !== 0) {
            const response = await commentData.removeCommentByEvent(req.params.id);
        }

        const responseEvent = await eventsData.removeEventById(req.params.id);
        return res.sendStatus(200);

    } catch (e) {
        console.log(e);
    }


});


export default router;