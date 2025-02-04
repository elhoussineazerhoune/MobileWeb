const { raw } = require("mysql");
const { Categorie } = require("../Models/Categorie");
const { Article } = require("../Models/Article");

const findAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();
    res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des categories  " + error,
      });
  }
};

const hasChilds = (categorie, population) => {
  try {
    const childs = population.filter((cat) => cat.parent_id === categorie.id);

    return childs;
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des categories  " + error,
      });
  }
};

const getAllChildsCategs = (categorie, population) => {
  const childs = hasChilds(categorie, population);
  const tree = [];
  for (const child of childs) {
    tree.push({
      ...child.dataValues,
      children: getAllChildsCategs(child, population),
    });
  }
  return tree;
};

const getCategorieTree = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await Categorie.findAll();

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    const tree = {
      ...categorie.dataValues,
      children: getAllChildsCategs(categorie, categories),
    };

    res.status(200).json(tree);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des catégories",
        error,
      });
  }
};

const getNestedCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    const nestedCategories = categories
      .filter((categ) => !categ.parent_id) // Filtrer les catégories racines (sans parentId)
      .map((rootCategory) => ({
        ...rootCategory.dataValues,
        children: getAllChildsCategs(rootCategory, categories),
      }));

    res.status(200).json(nestedCategories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des catégories",
        error,
      });
  }
};

const createCategorie = async (req, res) => {
  const CategorieData = {
    ...req.body, // Spread the body fields
  };

  const categorie = {
    nom_categorie: CategorieData.catName,
    maxOrdStock: CategorieData.maxOrdStack,
    LivraisonPrice: CategorieData.LivraisonPrice,
    parent_id: CategorieData.CatparentId,
  };
  console.log("data", categorie);
  try {
    const oneCategorie = await Categorie.create(categorie);
    res
      .status(201)
      .json({ success: true, message: "Categorie a été crées", oneCategorie });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de categorie", error });
  }
};

const UpdateCategorie = async (req, res) => {
  try {
    const [updatedCategorie] = await Categorie.update(req.body, {
      where: { id: req.body.id },
    });
    if (updatedCategorie) {
      res.json({
        success: true,
        message: "cette catégorie a été modifiée avec succées !",
      });
    } else {
      res.json({ success: false, message: "Echèc de modification !" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Erreur dans la mise à jour de cette catégorie !",
    });
  }
};

const DeleteCategorie = async (req, res) => {
  console.log("deletedCatid is : ", req.body.id);
  try {
    // Delete the main category
    const deletedCategorie = await Categorie.destroy({
      where: { id: req.body.id },
    });

    if (!deletedCategorie) {
      return res
        .status(404)
        .json({ success: false, message: "Catégorie introuvable !" });
    }

    // Find all subcategories
    const subCategories = await Categorie.findAll({
      where: { parent_id: req.body.id },
    });

    // Extract subcategory IDs
    const subCategoryIds = subCategories.map((sub) => sub.id);

    // Delete all articles linked to these subcategories
    if (subCategoryIds.length > 0) {
      await Article.destroy({
        where: { categorie_id: subCategoryIds },
      });
    }

    // Delete the subcategories
    await Categorie.destroy({
      where: { parent_id: req.body.id },
    });

    res.json({
      success: true,
      message:
        "Catégorie et ses sous-catégories ont été supprimées avec succès !",
    });
  } catch (error) {
    console.error("Error deleting category and related data:", error);
    res.status(500).json({
      success: false,
      message:
        "Erreur dans la suppression de cette catégorie et ses sous-catégories !",
    });
  }
};

const getFeuilles = (categ) => {
  let feuilles = [];
  if (!categ.children || categ.children.length === 0) {
    feuilles.push(categ);
  } else {
    categ.children.forEach((child) => {
      feuilles = feuilles.concat(getFeuilles(child));
    });
  }
  return feuilles;
};

const fetchFeuilles = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      attributes: ['id', 'nom_categorie', 'parent_id'], // Inclure `parent_id` pour construire la hiérarchie
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    // Construire les catégories imbriquées
    const nestedCategories = categories
      .filter((categ) => !categ.parent_id) // Catégories racines
      .map((rootCategory) => ({
        ...rootCategory.dataValues,
        children: getAllChildsCategs(rootCategory, categories),
      }));

    // Extraire les feuilles
    let feuilles = [];
    nestedCategories.forEach((category) => {
      feuilles = feuilles.concat(getFeuilles(category));
    });

    console.log("Les feuilles sont : ", feuilles);
    res.status(200).json({ feuilles });
  } catch (error) {
    console.error("Erreur lors de la récupération des feuilles :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  findAllCategories,
  getCategorieTree,
  getNestedCategories,
  createCategorie,
  UpdateCategorie,
  DeleteCategorie,
  fetchFeuilles
};
