import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadDocument } from "../controllers/pdf.controller.js";
import { askQuestion } from "../controllers/pdf.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/upload",authUser, upload.single("document"), uploadDocument);
router.post("/ask", authUser, askQuestion);
export default router;