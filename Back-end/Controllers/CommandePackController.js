const { CommandePack } = require("../Models/CommandePack.js");
const { Client } = require("../Models/Client.js");
const { Article } = require("../Models/Article.js");
const { index } = require("../Models/index.js");
const { Pack } = require("../Models/Pack.js");

const db = require("../Config/db.js");
const sequelize = db.getSequelize();

// const getAllCommandes = async (req, res) => {
//   try {
//     const commandes = await CommandePack.findAll({
//       order: [["updatedAt", "DESC"]],
//     });

//     const commandesPack = await Promise.all(
//       commandes.map(async (commande) => {
//         const packDemmande = await Pack.findOne({
//           where: { id: commande.packId },
//         });
//         const clientDemmande = await Client.findOne({
//           where: { id: commande.clientId },
//         });
//         if (!packDemmande) {
//           console.error(`Pack avec l'id ${commande.packId} introuvable.`);
//           return null; // Ignorer cette commande
//         }

//         if (!clientDemmande) {
//           console.error(`Client avec l'id ${commande.clientId} introuvable.`);
//           return null; // Ignorer cette commande
//         }
//         return {
//           id: commande.id,
//           image: packDemmande.imagePack,
//           packageName: packDemmande.nom,
//           packageId: packDemmande.id,
//           customerName: clientDemmande.nom,
//           status: commande.status,
//           price: packDemmande.prixTotal,
//           date: commande.updatedAt,
//           customerDetails: {
//             email: clientDemmande.email,
//             phone: clientDemmande.contact,
//             address: clientDemmande.adresse,
//           },
//         };
//       })
//     );

//     function addProductsToJson(commandesPack){
//       commandesPack.map(async (commandePack) => {
//         const pack = await Pack.findByPk(commandePack.packageId);
//         let produits;
//         pack.produits.map(async (prod) => {
//           const produit = await Article.findByPk(prod);
//           produits.push({
//             id: produit.id,
//             name: produit.nom,
//             price: produit.puv,
//           });
//         });
//         commandePack.products = produits;
//       });
//     }
//     addProductsToJson(commandesPack);
//     const filteredCommandesPack = commandesPack.filter(
//       (commande) => commande !== null
//     );
//     res.status(200).json({ success: true, orders: filteredCommandesPack });
//   } catch (error) {
//     console.error("Erreur lors de la récupération des commandes :", error);
//     res.status(500).json({ success: false, message: "Erreur serveur", error });
//   }
// };

const getAllCommandes = async (req, res) => {
  try {
    const commandesPackage = await CommandePack.findAll({
      order: [["createdAt", "DESC"]],
    });
    let infos = [];
    commandesPackage.map((commandePackage) => {
      infos.push({
        id: commandePackage.id,
        pack: commandePackage.packId,
        client: commandePackage.clientId,
        status: commandePackage.status,
        date: commandePackage.updatedAt,
      });
    });
    res.status(200).json({ success: true, orders: infos });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "can not get All commande od packages" });
  }
};

const insertCommande = async (req, res) => {
  try {
    const { packInfo } = req.body;
    const { userInfo, packId } = packInfo;
    console.log("packInfo : ", packInfo);
    const client = await Client.findOne({ where: { email: userInfo.email } });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client doesn't exist!" });
    }

    const commandePackage = {
      clientId: client.id,
      packId: packId,
    };
    const newCommande = await CommandePack.create(commandePackage);

    console.log("newCommandePack : ", newCommande);

    res.status(200).json({
      success: true,
      message: "Command inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Command of Package can not be Inserted ! try again please",
      error,
    });
  }
};

const updateCommande = async (req, res) => {
  const { id, status } = req.body;
  console.log("id : ", id);
  console.log("status : ", status);
  try {
    const commande = await CommandePack.findByPk(id);
    if (!commande) {
      return res
        .status(404)
        .json({ success: false, message: "Commande not found" });
    }
    commande.status = status;
    await commande.save();
    console.log(commande);
    res
      .status(200)
      .json({ success: true, message: "Commande updated successfully" });
  } catch (error) {
    console.error("Error updating Commande:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating Commande", error });
  }
};

module.exports = {
  getAllCommandes,
  insertCommande,
  updateCommande,
};
