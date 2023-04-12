// import usersRoute from './users.js';
// import postsRoute from './posts.js';

import userRoutes from './users.js';
import eventsRoute from './events.js';
import postRoutes from './posts.js';
import commentRoutes from './comments.js';
// import commentsRoute from './comments.js'

const constructorMethod = (app) => {

    app.use('/posts',postRoutes);
    app.use('/events', eventsRoute);

    app.use('/comments', commentsRoute);
    app.use('/users', userRoutes);


    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
    });
};

export default constructorMethod;


