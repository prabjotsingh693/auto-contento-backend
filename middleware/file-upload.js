const multer = require("multer");
const { v4: uuid } = require("uuid");

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "upload/images");
    },
    filename: (req, file, cb) => {
      cb(null, uuid() + ".png");
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = file.mimetype === "image/png" ? true : false;
    const error = isValid ? null : new Error('invalid mime type');
    cb(error, isValid);
  },
});

module.exports = fileUpload;
