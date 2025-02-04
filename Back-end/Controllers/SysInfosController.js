const { exit } = require("process");
const { SystemeInfos } = require("../Models/SystemeInfos");
const fs = require("fs");

/**
 * Créer un nouvel élément dans la table SystemeInfos.
 */
const createElement = async (req, res) => {
  try {
     console.log("hello");
    const image_filname = req.file.filname;
    console.log("filname : ",filname);

    const elementData = {
      ...req.body,
      image: image_filname,
    };
    console.log("elementData : ", elementData);
    const newElement = await SystemeInfos.create(elementData);
    res.status(201).json({
     success: true,
     message: "l'élément a été créé avec succès",
     data: newElement,
   });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error lors de la creation de l'element",
      error
    });
  }
};

/**
 * Récupérer tous les éléments de la table SystemeInfos.
 */
const getAll = async (req, res) => {
  try {
    const elements = await SystemeInfos.findAll();
    res.status(200).json({ success: true, data: elements });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch elements", error });
  }
};

/**
 * Récupérer un élément par ID dans la table SystemeInfos.
 */
const getElementById = async (req, res) => {
  try {
    const { id } = req.params;
    const element = await SystemeInfos.findByPk(id);

    if (!element) {
      return res
        .status(404)
        .json({ success: false, message: "Element not found" });
    }

    res.status(200).json({ success: true, data: element });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch element", error });
  }
};

/**
 * Mettre à jour un élément dans la table SystemeInfos.
 */
const updateElement = async (req, res) => {
  try {
    const { id, title, description, link, image } = req.body;

    const element = await SystemeInfos.findByPk(id);

    if (!element) {
      return res
        .status(404)
        .json({ success: false, message: "Element not found" });
    }

    const updatedElement = await element.update({
      title,
      description,
      link,
      image,
    });
    res.status(200).json({
      success: true,
      message: "Element updated successfully",
      data: updatedElement,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update element", error });
  }
};

/**
 * Supprimer un élément de la table SystemeInfos.
 */
const deleteElement = async (req, res) => {
  try {
    const { id } = req.body;

    const element = await SystemeInfos.findByPk(id);

    if (!element) {
      return res
        .status(404)
        .json({ success: false, message: "Element not found" });
    }

    await element.destroy();
    res
      .status(200)
      .json({ success: true, message: "Element deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete element", error });
  }
};

module.exports = {
  createElement,
  getAll,
  getElementById,
  updateElement,
  deleteElement,
};
