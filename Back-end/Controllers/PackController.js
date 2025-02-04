const { Pack } = require("../Models/Pack.js");
const { Article } = require("../Models/Article.js");
const { where } = require("sequelize");
const { raw } = require("mysql");

const addPack = async (req, res) => {
  try {
    const { ids } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const packInf = JSON.parse(req.body.packInfo);

    // Convert comma-separated string to array and ensure numbers
    const productsArray = ids.split(',').map(id => parseInt(id.trim()));

    if (!Array.isArray(productsArray)) {
      console.log("Failed to convert ids to array:", productsArray);
      return res.status(400).json({
        success: false,
        message: "Failed to process product IDs"
      });
    }

    const pack = await Pack.create({
      nom: packInf.Name,
      produits: productsArray,  // Now using the converted array
      prixTotal: packInf.price,
      description: packInf.Descreption,
      oldPrix: packInf.Total,
      imagePack: imagePath
    });

    if (pack) {
      console.log("Pack created successfully");
      res.status(201).json({
        success: true,
        message: "Pack created successfully",
        data: pack,
      });
    } else {
      console.log("Pack did not create");
      res.status(501).json({
        success: false,
        message: "Pack is not created",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in creating package!",
      error: error.message,
    });
  }
};

const getPackById = async (req, res) => {
  try {
    const { id } = req.params;
    const pack = await Pack.findByPk(id);
    const package = {
      packageId: pack.id,
      image: pack.imagePack,
      packageName: pack.nom,
      price: pack.prixTotal,
    };
    res.status(200).json({ success: true, pack: package });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching pack.",
    });
  }
};

const getPacks = async (req, res) => {
  try {
    const packs = await Pack.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    const results = [];

    for (const pack of packs) {
      const newProduits = [];
      const produits = pack.produits;

      for (const pro of produits) {
        const article = await Article.findByPk(pro, {
          attributes: ["nom", "image", "puv"],
          raw: true,
        });

        if (article) {
          newProduits.push({
            item: pro,
            nom: article.nom,
            image: article.image,
            price: article.puv,
          });
        }
      }
      results.push({
        pack,
        produits: newProduits,
      });
    }
    // console.log("produits =>", results.produits);
    res.status(200).json({ success: true, results }); // Send the final response
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching packs.",
    });
  }
};

const deletePack = async (req, res) => {
  try {
    const { id } = req.body; // Extract the pack ID from the request body

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Pack ID is required" });
    }

    // Attempt to find and delete the pack by ID
    const deletedPack = await Pack.destroy({
      where: { id: id },
    });

    if (deletedPack === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Pack not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Pack deleted successfully" });
  } catch (error) {
    console.error("Error deleting pack:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the pack",
    });
  }
};

module.exports = { addPack, getPacks, deletePack, getPackById };
