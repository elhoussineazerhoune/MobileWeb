const express = require('express');
const PackRouter = express.Router();
const { addPack, getPacks, deletePack, getPackById } = require('../Controllers/PackController.js');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "Uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });


PackRouter.post('/add', upload.single("image"), addPack);
PackRouter.get('/', getPacks);
PackRouter.get('/:id', getPackById);
PackRouter.post('/delete', deletePack);

module.exports = { PackRouter };