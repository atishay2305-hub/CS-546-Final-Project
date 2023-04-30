import { postData, eventsData } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from "mongodb"; 
import { events } from "../config/mongoCollections.js";
const router = Router();

// router.get('/search', async (req, res) => {
//     const eventCollection = await events()
//     const searchResults = eventsData.searchResults()
//     return.redire

// })