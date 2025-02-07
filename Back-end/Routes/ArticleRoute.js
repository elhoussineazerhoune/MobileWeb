const express = require("express");
const {
  createArticle,
  updatearticle,
  deleteArticle,
  fetchAllArticles,
  findProductsRandomlly,
  fetchByCategorie,
  fetchPopularProducts,
  findLastProducts,
  fetchPartByPart,
  findRandomProducts,
  findByCategory
} = require("../Controllers/ArticleController.js");
const multer = require("multer");
const { checkRoles } = require("../Middlewares/Middlewares.js");
const ArticleRouter = express.Router();

const storage = multer.diskStorage({
  destination: "Uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

ArticleRouter.get("/", findLastProducts);
ArticleRouter.get("/findAll", fetchAllArticles);
ArticleRouter.get("/findRandom", findProductsRandomlly);
ArticleRouter.get("/populars", fetchPopularProducts);
ArticleRouter.post("/add", upload.single("image"), createArticle);
ArticleRouter.post("/update", upload.single("image"), updatearticle);
ArticleRouter.post("/delete", deleteArticle);
ArticleRouter.post("/paginated", fetchPartByPart);
ArticleRouter.get("/:id", fetchByCategorie);
ArticleRouter.get("/category/:categoryId", findByCategory);
ArticleRouter.get("/random", findRandomProducts);
// ArticleRouter.get("/category/:categoryId", findByCategory);

module.exports = { ArticleRouter };
