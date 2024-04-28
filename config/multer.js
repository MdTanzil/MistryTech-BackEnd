const multer = require("multer");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    // Extract the file extension
    const fileExt = file.originalname.split(".").pop();
    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt);
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;
