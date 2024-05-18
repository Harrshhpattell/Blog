import express from "express";
import { getNotifications, getPostLikes, getTotalLikesPerPost } from "../controllers/user.js";


const router = express.Router();

// Route to handle getting post likes, adding a new like, or deleting an existing like
router.post("/likes/:userid/:postid", getPostLikes);
router.get("/likes", getTotalLikesPerPost);
router.get("/notification", getNotifications);

export default router;
