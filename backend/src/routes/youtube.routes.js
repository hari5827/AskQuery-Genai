import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { uploadLimiter } from "../middleware/rateLimit.middleware.js";
import { addYoutubeVideo } from "../controllers/youtube.controller.js";

const router = express.Router();

router.post("/add", authUser, uploadLimiter, addYoutubeVideo);

export default router;
