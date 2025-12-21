import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 7 * 1024 * 1024, // 7 MB
  },
});

export default upload;
