import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadDocument } from "../controllers/pdf.controller.js";

const router = express.Router();

router.post("/upload", upload.single("document"), uploadDocument);

export default router;