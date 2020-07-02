const express = require("express");

const userController = require('../controller/imageCombiner');
const fileUpload = require('../middleware/file-upload')

const checkToken = require("../middleware/check-auth");

const router = express.Router();

router.use(checkToken);

router.post("/",fileUpload.single('image'), userController.imageCombiner );

module.exports = router;
