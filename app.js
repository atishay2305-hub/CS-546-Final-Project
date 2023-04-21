import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
const handlebars = require('express-handlebars');

app.use(express.json());

configRoutes(app);

// TODO: IMPLEMENT MIDDLEWARE HERE

// events 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/create-event', (req, res) => {
    res.render('events');
})

app.post('/create-event', (req, res) =>{
    res.render('events');
})

app.get('/search-events', (req, res) => {
    const searchBy = req.query.searchBy;
    let events = [];

    if(searchBy === "id"){
        const id = req.query.id;
    }

    if(searchBy === "buildingName"){
        const buildingName = req.query.buildingName;
    }

    if(searchBy === "eventName"){
        const eventName = req.query.eventName;
    }

    if(searchBy === "organizer"){
        const organizer = req.query.organizer;
    }

    res.render('search-events', {
        events: events
    });
});

app.get('/remove-event', (req, res) => {
    res.render('removeEvents');
})

app.post('/remove-event', (req, res) => {
    const id = req.body.id;
    res.redirect('/remove-event');
});

app.get('/update-event', (req, res) => {
    res.render('update-event');
});

app.post('/update-event', (req, res) => {
    const id = req.body.id;
    const eventName = req.body.eventName;
    const description = req.body.description;
    const buildingName = req.body.buildingName;
    const organizer = req.body.organizer;
    const seatingCapacity = req.body.seatingCapacity;
    res.redirect('/update-event');
})



// posts 

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

