const path = require('path');
const fs = require('fs');
const multer = require('multer');

let storage;
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_key';

if (hasCloudinary) {
  const cloudinaryConfig = require('../config/cloudinary');
  storage = cloudinaryConfig.storage;
} else {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      cb(null, name);
    },
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
