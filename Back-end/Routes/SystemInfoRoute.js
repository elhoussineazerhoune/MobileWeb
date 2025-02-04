const express = require("express");
const SystemRouter = express.Router();
const multer = require("multer");
const { checkRoles } = require("../Middlewares/Middlewares.js");
const {
  createElement,
  getElementById,
  deleteElement,
  updateElement,
  getAll,
} = require("../Controllers/SysInfosController.js");

const storage = multer.diskStorage({
  destination: "Uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

SystemRouter.post("/hero", upload.single("image"), createElement);
SystemRouter.get("/hero", getAll);
SystemRouter.get("/hero/:id", getElementById);
SystemRouter.put("/hero", upload.single("image"), updateElement);
SystemRouter.delete("/hero", deleteElement);

module.exports = { SystemRouter };


/**
 * ----------------------------------------------
 */

// router of links (facebook intagram whatsApp tiktok)

// SystemRouter.post("/sm", createMediaElement);
// SystemRouter.get("/sm", getAllMediaElement);
// SystemRouter.get("/sm/:id", getMediaElementById);
// SystemRouter.put("sm/", updateMediaElement);
// SystemRouter.delete("/sm", deleteMediaElement);


//   createMediaElement,
//   getAllMediaElement,
//   getMediaElementById,
//   updateMediaElement,
//   deleteMediaElement