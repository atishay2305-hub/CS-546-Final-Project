import express from "express";
import discussData from "../data/discussion.js";

const router = express.Router();

router.route('/discussion')
    .get(async (req, res) => {
        return res.status(200).render('discuss', 'Discussions');
    })
    .post(async (req, res) => {
        const { category, topic, discussion, userName } = req.body;
        const discuss = await discussData.createDiscussion(category, topic, discussion, userName);
        return res.status(200).render('discuss', { newDiscussion: discuss });
    });



export default router;
