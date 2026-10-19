const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "application/pdf" ||
      !file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return cb(new Error("Only PDF files are allowed."));
    }

    cb(null, true);
  },
});

const uploadPdf = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const status = err instanceof multer.MulterError &&
        err.code === "LIMIT_FILE_SIZE" ? 413 : 400;

      return res.status(status).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

module.exports = uploadPdf;