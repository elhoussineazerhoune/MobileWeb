const express = require("express");
const {
  findAllCategories,
  getCategorieTree,
  getNestedCategories,
  createCategorie,
  UpdateCategorie,
  DeleteCategorie,
  fetchFeuilles
} = require("../Controllers/CategorieController.js");

const CategorieRouter = express.Router();

CategorieRouter.get("/", findAllCategories);
CategorieRouter.get("/subcategories/:id", getCategorieTree);
CategorieRouter.get("/nestedCategories", getNestedCategories);
CategorieRouter.get("/feuillesCategs", fetchFeuilles);
CategorieRouter.post("/add", createCategorie);
CategorieRouter.post("/update", UpdateCategorie);
CategorieRouter.post("/delete", DeleteCategorie);

module.exports = { CategorieRouter };
