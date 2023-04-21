import { postData, eventsData } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from "mongodb"; 
const router = Router();

router.get('/search', async (req, res) => {
const query = req.query.query;

const results = await Post.find({
    $or: [
        {title: {$regex: query, $options: 'i'}},
        {content: {$regex: query, $options: 'i'}}
    ]
});

results.render('searchResults', {results});
});