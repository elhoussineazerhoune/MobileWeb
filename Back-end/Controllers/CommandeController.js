const { Commande } = require("../Models/Commande");
const { Client } = require("../Models/Client.js");
const { CommandeDetail } = require("../Models/CommadeDetails.js");
const { Article } = require("../Models/Article.js");
const { index } = require("../Models/index.js");
const { Pack } = require("../Models/Pack.js");

const updateCommande = async (req, res) => {
  const { id, newStatus } = req.body;
  console.log(req.body);

  if (!id || !newStatus) {
    return res
      .status(404)
      .json({ success: false, message: "Erreur sur id ou status" });
  }

  try {
    const [updatedCommande] = await Commande.update(
      { status: newStatus },
      { where: { id } }
    );
    const commandUpdated = await Commande.findByPk(id);

    if (commandUpdated && commandUpdated.status === newStatus) {
      if (newStatus === "validé") {
        const cmdDetail = await CommandeDetail.findAll({
          where: { commandeId: commandUpdated.id },
        });

        const updateStockPromises = cmdDetail.map(async (cmd) => {
          const product = await Article.findByPk(cmd.dataValues.articleId);

          const newStock = product.dataValues.stock - cmd.dataValues.quantite;
          if (newStock >= 0) {
            await Article.update(
              { stock: newStock },
              { where: { id: product.dataValues.id } }
            );
            console.log(
              `Stock mis à jour pour le produit ID ${product.dataValues.id}: nouveau stock = ${newStock}`
            );
          } else {
            console.log(
              `Stock insuffisant pour le produit ID ${product.dataValues.id}`
            );
          }
        });

        await Promise.all(updateStockPromises);
      }
      res
        .status(200)
        .json({ success: true, message: `Commande a été ${newStatus}` });
    } else {
      res.status(404).json({
        success: false,
        message: "Erreur sur la mise à jour de la commande",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la commande",
      error,
    });
  }
};

const acceptCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const commande = await Commande.findByPk(id);
    if (commande) {
      commande.status = "accepted";
      await commande.save();
      res.status(200).json({ message: "Commande acceptée avec succès" });
    } else {
      res.status(404).json({ message: "Commande non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'acceptation de la commande", error });
  }
};

const refuseCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const commande = await Commande.findByPk(id);
    if (commande) {
      commande.status = "refused";
      await commande.save();
      res.status(200).json({ message: "Commande refusée avec succès" });
    } else {
      res.status(404).json({ message: "Commande non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors du refus de la commande", error });
  }
};

const deleteCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Commande.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: "Commande supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Commande non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la commande", error });
  }
};

// const findAllCommandes = async (req, res) => {
//     try {
//         const commandes = await Commande.findAll();

//         // Fetch client names for each commande using ClientId
//         const commandesWithClientNames = await Promise.all(
//             commandes.map(async (commande) => {
//                 const client = await Client.findByPk(commande.clientId); // Fetch the client by ID
//                 return {
//                     ...commande.toJSON(), // Convert Sequelize instance to plain object
//                     clientName: client ? `${client.nom} ${client.prenom}` : "Client not found",
//                 };
//             })
//         );

//         console.log("Commandes with client names:", commandesWithClientNames); // Log the processed data
//         res.status(200).json(commandesWithClientNames); // Send the processed data with client names
//     } catch (error) {
//         console.error("Error while retrieving commandes:", error); // Log the error
//         res.status(500).json({
//             message: "Erreur lors de la récupération des commandes",
//             error: error.message || error.toString() || error
//         });
//     }
// };

const getAllCommandesWithDetails = async (req, res) => {
  try {
    // Récupérer toutes les commandes avec leurs détails
    const commandes = await Commande.findAll({
      include: [
        {
          model: CommandeDetail,
          as: "details",
          include: [
            {
              model: Article,
              as: "article", // Inclure les informations sur l'article
              attributes: ["id", "nom", "puv", "description"], // Sélectionner les colonnes pertinentes
            },
          ],
        },
        {
          model: Client,
          as: "client", // Inclure les informations du client
          attributes: ["id", "nom", "prenom", "email", "contact", "adresse"],
        },
      ],
    });

    // Répondre avec les données récupérées
    // commandes.map((commande) => {
    //     console.log(JSON.stringify(commande, null, 2));
    // });
    return res.status(200).json({
      success: true,
      data: commandes,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes avec détails:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des commandes.",
    });
  }
};

const findOneCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const commande = await Commande.findByPk(id);
    if (commande) {
      res.status(200).json(commande);
    } else {
      res.status(404).json({ message: "Commande non trouvée" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la commande",
      error,
    });
  }
};

const InsertCommand = async (req, res) => {
  try {
    const CommandeComing = req.body;

    // Destructure the required data
    const { userInfo, basketItems, totalPrice, paymentMethod } = CommandeComing;

    // Check if userInfo exists
    if (!userInfo?.email || !basketItems?.length || !totalPrice || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Données de commande invalides. Veuillez vérifier tous les champs requis."
      });
    }

    // Check if basketItems exists
    if (!basketItems || basketItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Basket items are missing!" });
    }

    // Find the client in the database    

    const ClientExists = await Client.findOne({
      where: { email: userInfo.email },
    });
    if (!ClientExists) {
      return res
        .status(404)
        .json({ success: false, message: "Client doesn't exist!" });
    }
    const clientId = ClientExists.id;
    const [ClientUpdated] = await Client.update(
      {
        nom: userInfo.nom,
        prenom: userInfo.prenom,
        adresse: userInfo.address,
        contact: userInfo.telephone,
      },
      { where: { id: clientId } }
    );
    console.log("client updated", ClientUpdated);

    // Insert the command
    const insertedCommand = await Commande.create({
      clientId: clientId,
      prixTotal: totalPrice,
      paymentMethod: paymentMethod,
    });
    console.log(basketItems);
    

    const commandId = insertedCommand.id;

    // Insert each basket item into CommandeDetail
    for (const item of JSON.parse(basketItems)) {
      await CommandeDetail.create({
        commandeId: commandId,
        articleId: item.id,
        quantite: item.quantity,
        totalLigne: item.puv*item.quantity,
      });
    }

    // Send a success response
    res
      .status(201)
      .json({ success: true, message: "Command inserted successfully!" });
  } catch (error) {
    console.error("Error in InsertCommand:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getClientOrders = async (req, res) => {
  const { id } = req.params; // Récupérer l'identifiant depuis req.params
  try {
    const orders = await Commande.findAll({
      where: { clientId: id }, // Ajouter une clause where pour filtrer par clientId
      include: [
        {
          model: CommandeDetail,
          as: "details",
          include: [
            {
              model: Article,
              as: "article", // Inclure les informations sur l'article
              attributes: ["id", "nom", "puv", "description","image"], // Sélectionner les colonnes pertinentes
            },
          ],
        },
        {
          model: Client,
          as: "client", // Inclure les informations du client
          attributes: ["id", "nom", "prenom", "email", "contact", "adresse"],
        },
      ],
    });

    console.log(`Commandes du client avec ID ${id} :`, orders);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des commandes pour le client avec ID ${id} :`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération des commandes.",
      error: error.message,
    });
  }
};

const getCommandeById = async (req, res) => {
  const { id } = req.params;
  console.log("id",id);
  
  try {
    const commande = await Commande.findOne({
      where: { id },
      include: [
        {
          model: CommandeDetail,
          as: "details",
          include: [
            {
              model: Article,
              as: "article",
              attributes: ["id", "nom", "puv", "description"],
            },
          ],
        },
        {
          model: Client,
          as: "client",
          attributes: ["id", "nom", "prenom", "email", "contact", "adresse"],
        },
      ],
    });

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée"
      });
    }

    res.status(200).json({
      success: true,
      data: commande
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la commande",
      error: error.message
    });
  }
};

module.exports = {
  updateCommande,
  acceptCommande,
  refuseCommande,
  deleteCommande,
  getAllCommandesWithDetails,
  findOneCommande,
  InsertCommand,
  getClientOrders,
  getCommandeById
};
