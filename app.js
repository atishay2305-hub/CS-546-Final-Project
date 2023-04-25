import express from "express";
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
import cookieParser from 'cookie-parser';
app.use(cookieParser());
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



app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");


app.use(session({
    name: 'AuthCookie',
    secret: 'myKeySecret',
    resave: false,
    saveUninitialized: true
  }));

// app.use('/', (req, res, next) => {
//   if (req.session.user) {
//       if (req.session.user.role === 'admin') {
//           return res.redirect('/admin');
//       } else if (req.session.user.role === 'user') {
//           return res.redirect('/protected');
//       }
//   }
//   next();
// });

// app.use('/login', (req, res, next) => {
//     if (!req.session.user) {
//         return res.redirect('/');
//     }
//     req.method = 'post';
//     next();
// });

//   app.use('/register', (req, res, next) => {
//     if (req.session.user) {
//         return res.redirect('/');
//     }
//     next();
// });


//   app.use('/admin', (req, res, next) => {
//     if (!req.session.user) {
//         return res.redirect('/login');
//     } else if (req.session.user.role !== 'admin') {
//         return res.status(403).render('error', {
//             title: "Error",
//             message: "You do not have permission to view this page."
//         });
//     }
//     next();
// });

  // chao's code here
//   app.use('/protected', (req, res, next) => {
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }
//     next();
// });


// app.use('/logout', (req, res, next) => {
//   if (!req.session.user) {
//       return res.redirect('/login');
//   }
//   next();
// });

configRoutes(app);
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

