// import usersRoute from './users.js';
// import postsRoute from './posts.js';
import eventsRoute from './events.js'
// import commentsRoute from './comments.js'

const constructorMethod = (app) => {
    // app.use('/users', usersRoute);
    // app.use('/posts', postsRoute);
    app.use('/events', eventsRoute);
    // app.use('/comments', commentsRoute);

    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
    });
};

export default constructorMethod;