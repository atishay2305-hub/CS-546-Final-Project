import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
// import handlebars from 'express-handlebars';

import {fileURLToPath} from 'url';
import  {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');
app.use('/public', staticDir);

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

