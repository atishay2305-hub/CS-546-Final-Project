

import userRoutes from './users.js';
import eventsRoute from './events.js';
// import postRoutes from './posts.js';
import authRoutes from './auth.js';

import commentsRoute from './comments.js'

const constructorMethod = (app) => {


  app.use('/comments', commentsRoute);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('pageNotFound', {title: '404'});
  });
}

export default constructorMethod;


