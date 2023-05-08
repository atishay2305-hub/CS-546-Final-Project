import postData from "../data/posts.js";
import router from "./auth.js";
import userData from "../data/users.js";
import commentData from "../data/comments.js";
import {comments} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import eventsData from "../data/events.js";


router
    .route('/:id')
    .get(async (req, res) => {
        const post = await postData.getPostById(req.params.id);
        const deletable = (req.session.user.role === 'admin' || req.session.user.userId === post.userId);
        const comments = await commentData.getPostCommentById(req.params.id);
        res.render("postEdit", {
            userId: req.session.user.userId,
            email: req.session.user.email,
            deletable: deletable,
            post: post,
            comments: comments
        });
})
    .delete(async (req, res) => {
        try{
            const removeComments = await commentData.removeCommentByPost(req.params.id);
            const responsePost = await postData.removePostById(req.params.id);
            if(!responsePost.deleted || !removeComments.deleted){
                return res.status(400).json("Unable to delete")
            }
            return res.sendStatus(200);
        } catch (e) {
            console.log(e);
        }
});



router
    .route('/:id/comment')
    .post(async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const postId = req.params.id;
        const {commentText} = req.body;
        // console.log(postId);
        // console.log(commentText);
        const comment = await commentData.createComment(userId, null, postId, commentText, "post");
        console.log(comment);
        const post = await postData.putComment(postId, comment.commentId);
        // console.log(post);
        console.log('The comment is added');
        return res.redirect('/posts');
    } catch (e) {
        console.log(e);
    }
});

router
    .route('/:postId/comments/:id')
    .delete(async (req, res) => {
        try {
            const postId = req.params.postId;
            const commentId = req.params.id;
            const comments = await commentData.removeCommentById(commentId);
            if (!comments.deleteInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Fail to delete attendee or event attended list"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Comment deleted successfully"
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                success: false,
                message: "Something went wrong."
            });
        }
    });


export default router;
