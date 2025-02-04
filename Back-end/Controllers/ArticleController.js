const { exit } = require("process");
const { Article, Categorie } = require("../Models");
const fs = require("fs");
// const mital = {
//   nom: "cc",
//   puv: "1",
//   image: "blob:http://localhost:5173/4d85fe76-4c7f-450c-8017-daccaefdbc2a",
//   stock: "21",
//   categorie_id: 44,
//   description: "cccc",
// };

const createArticle = async (req, res) => {
  try {
    const image_filename = req.file.filename;
    const articleData = {
      ...req.body,
      image: image_filename,
    };

    const existingArticle = await Article.findOne({
      where: { nom: articleData.nom },
    });

    if (existingArticle) {
      const newStock =
        Number(existingArticle.stock) + Number(articleData.stock);
      const updatedArticle = await Article.update(
        {
          ...articleData,
          stock: newStock,
        },
        { where: { id: existingArticle.id } }
      );

      if (updatedArticle[0] === 1) {
        return res.status(200).json({
          success: true,
          message: "Le stock a été mis à jour",
          article: existingArticle,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Le stock n'a pas pu être mis à jour",
        });
      }
    }

    const newArticle = await Article.create(articleData);
    res.status(201).json({
      success: true,
      message: "Article a été créé avec succès",
      article: newArticle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'article",
      error: error.message,
    });
  }
};

const updatearticle = async (req, res) => {
  try {
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de l'article manquant",
      });
    }

    // Get the current article to find the old image
    const currentArticle = await Article.findByPk(id);
    if (!currentArticle) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    // Only update image if a new file was uploaded
    if (req.file) {
      const image_filename = `${req.file.filename}`;
      updates.image = image_filename;

      // Delete the old image if it exists
      if (currentArticle.image) {
        const oldImagePath = `Uploads/${currentArticle.image}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
      }
    }

    const [updatedRows] = await Article.update(updates, {
      where: { id: id },
    });

    if (updatedRows > 0) {
      res.status(200).json({ success: true, message: "Article a été modifié" });
    } else {
      res.status(404).json({ success: false, message: "Article non trouvé" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'article",
      error,
    });
  }
};

const deleteArticle = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "ID de produit manquant" });
  }

  try {
    const name = await Article.findByPk(productId, {
      attributes: ["nom", "image"],
    });
    const deleted = await Article.destroy({
      where: { id: productId },
    });

    if (deleted === 1) {
      fs.unlink(`Uploads/${name.dataValues.nom}`, () => {
        console.log("deleted");
      });
      return res
        .status(200)
        .json({ success: true, message: "Article supprimé avec succès" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Article non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur", error });
  }
};

const fetchByCategorie = async (req, res) => {
  const { id } = req.params;

  try {
    const categories = await Categorie.findAll();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    // Fonction récursive pour récupérer toutes les sous-catégories
    const getAllChildIds = (parentId, allCategories) => {
      const childCategories = allCategories.filter(
        (c) => c.parent_id === parentId
      );
      let ids = childCategories.map((c) => c.id); // Ajouter les IDs des sous-catégories immédiates

      // Récursion pour les sous-catégories de chaque sous-catégorie
      childCategories.forEach((child) => {
        ids = ids.concat(getAllChildIds(child.id, allCategories));
      });

      return ids;
    };

    // Récupérer tous les IDs des sous-catégories à partir de la catégorie donnée
    const categoryIds = [id, ...getAllChildIds(Number(id), categories)];

    // Rechercher les produits dans toutes ces catégories
    const products = await Article.findAll({
      where: {
        categorie_id: categoryIds,
      },
    });

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Aucun produit trouvé pour cette catégorie",
      });
    }

    return res.status(200).json({ success: true, filteredProducts: products });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const fetchAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ success: true, products: articles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
};

const fetchPartByPart = async (req, res) => {
  const { start = 0, limit = 12 } = req.body;
  try {
    const { count, rows: paginatedArticles } = await Article.findAndCountAll({
      order: [["updatedAt", "DESC"]],
      offset: parseInt(start), // Décalage pour commencer à "start"
      limit: parseInt(limit), // Nombre de résultats à récupérer
    });

    res.status(200).json({
      success: true,
      products: paginatedArticles,
      ProductsNb: count, // Nombre total d'articles dans la base
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
};

const findProductsRandomlly = async (req, res) => {
  try {
    const products = await Article.findAll({
      limit: 8,
    });

    let shuffledProducts = [...products];
    for (let i = shuffledProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledProducts[i], shuffledProducts[j]] = [
        shuffledProducts[j],
        shuffledProducts[i],
      ];
    }

    res.status(200).json({
      success: true,
      data: shuffledProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des produits aléatoires",
      error: error.message,
    });
  }
};

const fetchPopularProducts = async (req, res) => {
  try {
    const populars = await Article.findAll({
      order: [["NbCommande", "DESC"]],
      limit: 3,
    });
    const popularProduits = await Promise.all(
      populars.map(async (popular) => {
        const categorie = await Categorie.findByPk(popular.categorie_id);
        const categName = categorie ? categorie.nom_categorie : null;

        return {
          image: popular.image,
          price: popular.puv,
          title: popular.nom,
          link: categName,
        };
      })
    );
    console.log("populars : ", popularProduits);
    res.status(200).json({ success: true, populars: popularProduits });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "can not fetch the popular products",
      error,
    });
  }
};

// this method return the article but not send to the frontend
const findAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [["updatedAt", "DESC"]], // Trie par updatedAt dans l'ordre décroissant
    });
    return articles;
  } catch (error) {
    return { message: "Erreur lors de la récupération des articles" + error };
  }
};

const findLastProducts = async (req, res) => {
  try {
    const lasts = await Article.findAll({
      include: [
        {
          model: Categorie,
          as: "categorie", // Add the alias here
          attributes: ["nom_categorie", "LivraisonPrice"],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: 10,
      attributes: [
        "id",
        "image",
        "puv",
        "nom",
        "description",
        "stock",
        "categorie_id",
      ],
    });

    const lastProduits = lasts.map((last) => ({
      id: last.id,
      image: last.image,
      price: last.puv,
      name: last.nom,
      description: last.description,
      stock: last.stock,
      deliveryPrice: last.categorie?.LivraisonPrice || null, // Updated to match alias
      categorie: last.categorie?.nom_categorie || null, // Updated to match alias
    }));

    res.status(200).json({ success: true, lasts: lastProduits });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not fetch the last products",
      error: error.message,
    });
  }
};

const findOneArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findOne({ where: { id: id } });
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article non trouvé" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'article", error });
  }
};

module.exports = {
  createArticle,
  updatearticle,
  deleteArticle,
  findLastProducts,
  findOneArticle,
  fetchAllArticles,
  findProductsRandomlly,
  fetchByCategorie,
  fetchPopularProducts,
  fetchPartByPart,
};
