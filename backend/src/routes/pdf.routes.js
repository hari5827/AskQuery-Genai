import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { askQuestion, askQuestionStream, getDocuments, deleteDocument,uploadDocument } from "../controllers/pdf.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { askLimiter ,uploadLimiter } from "../middleware/rateLimit.middleware.js";
const router = express.Router();
router.post("/upload", authUser,  uploadLimiter,(req, res, next) => {
    upload.single("document")(req, res, (err) => {

        if (err) {

            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File size should not exceed 10 MB.",
                });
            }

            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        next();
    });
}, uploadDocument);
router.post("/ask", authUser, askLimiter,askQuestion);
router.post("/ask/stream", authUser, askLimiter, askQuestionStream);

router.get("/documents", authUser, getDocuments);

router.delete("/:documentId", authUser, deleteDocument);
export default router;