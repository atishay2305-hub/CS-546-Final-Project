import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
const handlebars = require('express-handlebars');

app.use(express.json());

configRoutes(app);

// TODO: IMPLEMENT MIDDLEWARE HERE

// setting up the handlebars engile
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

