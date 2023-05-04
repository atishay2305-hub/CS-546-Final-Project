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
app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public', staticDir);
import multer from "multer";
app.use(express.urlencoded({extended: true}));
app.use('/', staticDir);
import eventsRoutes from './routes/events.js';


app.use('/', eventsRoutes);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");

const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        checkCategory: function (category){
            return category === "lost&found";
        }
    }
})

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
    saveUninitialized: false,
    resave: false
}));


const isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

app.use('/posts', isLoggedIn);
app.use('/events', isLoggedIn);
app.use('/profile', isLoggedIn);
app.use('/homepage', isLoggedIn);
app.use('/logout', isLoggedIn);
app.use('/protected', isLoggedIn);

app.use('/login', (req, res, next) => {
    if (req.method === 'GET') {
        if (req.session.userId) {
            return res.redirect('/homepage')
        } else {
            return res.render('login');
        }
    }
    next();
});

app.use('/register', (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/login');
    }
    next();
  });

app.use('/posts', isLoggedIn);
app.use('/events', isLoggedIn);
app.use('/profile', isLoggedIn);
app.use('/homepage', isLoggedIn);
app.use('/logout', isLoggedIn);

app.use('/protected', isLoggedIn);


app.use('/logout', (req, res) => {
    if (!req.session.userId) {
        return res.render('login');
    }
    req.session.destroy();
    return res.render('logout');

});

configRoutes(app);

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});