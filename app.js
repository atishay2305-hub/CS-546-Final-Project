import express from "express";
import session from 'express-session';

const app = express();
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import exphbs from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
import cookieParser from 'cookie-parser';

app.use(cookieParser());
import {dirname} from 'path';

const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + '/public');
app.use(express.json());

app.use('/public', staticDir);
app.use(express.urlencoded({extended: true}));
app.use('/', staticDir);
import {userData} from "./data/index.js";

const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        if_eq: function (val1, val2) {
            return val1 === val2;
        },

        is_attendee: function (attendees, userId) {
            if(!attendees) return false;
            const attendeeList = attendees.split(',');
            const attendeeIds = attendeeList.map(attendee => attendee.split('userId: ')[1].split(' ')[0]);
            return attendeeIds.includes(userId);
        },

        not_past_date: function (date) {
            const eventDate = new Date(date).toISOString().slice(0, 10);
            const now = new Date().toISOString().slice(0, 10);
            return eventDate >= now;
        }
    }
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});


app.use(session({
    name: 'AuthCookie',
    secret: 'myKeySecret',
    saveUninitialized: true,
    resave: false
}));


const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

app.use('/posts', isLoggedIn);
app.use('/events', isLoggedIn);
app.use('/profile', isLoggedIn);
app.use('/homepage', isLoggedIn);
app.use('/discuss', isLoggedIn);
app.use('/logout', isLoggedIn);
app.use('/search', isLoggedIn)
app.use('/searchResults', isLoggedIn);
app.use('/allComments', isLoggedIn);
app.use('/discussionResults', isLoggedIn);
app.use('/protected', isLoggedIn);

app.use('/login', (req, res, next) => {
    if (req.method === 'GET') {
        if (req.session.user) {
            console.log("here")
            return res.redirect('/something')
        } else {
            return res.render('login');
        }
    }
    next();
});

app.use('/register', (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/login');
    }
    next();
});

// Route for logging out
app.use('/logout', (req, res) => {
    if (!req.session.user) {
        return res.render('login', {title: 'Login'});
    }
    req.session.destroy();
    return res.render('logout', {title: 'logout'});
});


configRoutes(app);

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
});


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
