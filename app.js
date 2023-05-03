import express from "express";
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
import cookieParser from 'cookie-parser';
app.use(cookieParser());
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
//import eventsRoutes from './routes/events.js';
//app.use('/', eventsRoutes);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
next();
});

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
next();
});

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

app.use(session({
    name: 'AuthCookie',
    secret: 'myKeySecret',
    saveUninitialized: false,
    resave: false
  }));


  // chao's code here
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



app.use('/login', (req, res, next) => {
  // if (!req.session.userId) {
  //     return res.redirect('login');
  // }
  // // req.method = 'post';
  // next();
  if (req.method === 'GET') {
    if (req.session.userId) {
      // console.log(req.session.userId)
      // if (req.session.user.role === 'admin') {
      //   return res.redirect('/admin');
      // } else {
      //   return res.redirect('/protected');
      // }
      return res.redirect('/homepage')
    }
  }
  next();
});

// app.use('/homepage', (req, res, next) => {
//     // if (!req.session.userId) {
//     //     return res.redirect('/login');
//     // }
//     // res.render('homepage')
//     // req.method = 'post';
//     next();
// });

  app.use('/register', (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/login');
    }
    next();
});


  app.use('/admin', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    } else if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            title: "Error",
            message: "You do not have permission to view this page."
        });
    }
    next();
});


  app.use('/protected', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
});


// app.use('/logout', (req, res, next) => {
//   if (!req.session.user) {
//       return res.redirect('/login');
//   }
//   req.session.destroy();
//   return res.render('logout');
//   // next();
// });
app.use('/logout',(req,res,next)=>{
  if(!req.session.userId){
      return res.render('logout')
  }
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // null for error argument
    cb(null, 'images')
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({storage: storage})

app.get("/upload", (req, res) => {
  res.render('upload')
});

app.post("/upload",upload.single('image'),(req, res) => {
  res.send("Image Uploaded")
});

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
