const express = require("express");
const router = express.Router();

const imageUploadController = require("../controllers/imageUpload.controller");

module.exports = router;

router.post("/", imageUploadController.post);
router.get("/:id", imageUploadController.get);
