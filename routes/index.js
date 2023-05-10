
import eventsRoute from './events.js';
import authRoutes from './auth.js';


const constructorMethod = (app) => {

    app.use('/',authRoutes);

    app.use('/events', eventsRoute);

    app.use('*', (req, res) => {
        res.render('pageNotFound', {title: '404'});
    });
};

export default constructorMethod;


