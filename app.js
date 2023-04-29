import express from "express";
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
// import cookieParser from 'cookie-parser';
// app.use(cookieParser());
import multer from "multer";
import path from "path";
import {dirname} from 'path';
const __dirname = dirname(__filename);
const staticDir= express.static(__dirname + '/public');
app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/public', staticDir);
app.use(express.urlencoded({extended: true}));
app.use('/', staticDir);
import eventsRoutes from './routes/events.js';
app.use('/', eventsRoutes);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(session({
    secret: 'myKeySecret',
    resave: false,
    saveUninitialized: true
  }));

configRoutes(app);
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

