// import Router from "express";
// import * as discussData from "../data/discussion.js";
// const router = Router();



// router.route('/discussion').get(async(req, res) => {
//     return res.status(200).render('discuss');
// });

// router.route('/discussion').post(async(req, res)=> {
//     const {category, topic, discussion, userName} = req.body;
//     const discuss = discussData.createDiscussion(category, topic, discussion, userName)
//     return res.status(200).render('discuss', {newDiscussion: discuss});
// })


import express from "express";
import * as discussData from "../data/discussion.js";

const router = express.Router();

router.route('/discussion')
    .get(async (req, res) => {
        return res.status(200).render('discuss');
    })
    .post(async (req, res) => {
        const { category, topic, discussion, userName } = req.body;
        const discuss = await discussData.createDiscussion(category, topic, discussion, userName);
        return res.status(200).render('discuss', { newDiscussion: discuss });
    });

export default router;
