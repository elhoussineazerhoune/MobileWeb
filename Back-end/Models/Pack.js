const { DataTypes } = require("sequelize");
const { sequelize } = require("../Config/db.js");

const Pack = sequelize.define(
  "Pack",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    produits: {
      type: DataTypes.JSON, // Stocke le tableau sous forme JSON
      allowNull: false,
      defaultValue: [], // Par défaut, un tableau vide
    },
    prixTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // Empêche les valeurs négatives
      },
    },
    oldPrix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0, // Empêche les valeurs négatives
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sexe: {
      type: DataTypes.ENUM("hommes", "femmes"),
      allowNull: false,
      defaultValue: "hommes",
    },
    imagePack: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "packs", // Nom de la table dans la base de données
    timestamps: true, // Inclut `createdAt` et `updatedAt` par défaut
  }
);

module.exports = { Pack };
