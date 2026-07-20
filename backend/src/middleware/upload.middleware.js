import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
  ".xlsx",
  ".xls",
  ".png",
  ".jpg",
  ".jpeg",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Unsupported file type"), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
});