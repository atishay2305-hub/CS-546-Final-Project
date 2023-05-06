import userRoutes from './users.js';
import eventsRoute from './events.js';
import commentRoutes from './comments.js';
import authRoutes from './auth.js';



const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/events', eventsRoute);
  app.use('/comments', commentRoutes);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('pageNotFound', {title: '404'});
  });
  
};

export default constructorMethod;

