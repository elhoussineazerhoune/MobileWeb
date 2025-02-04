const { DataTypes } = require("sequelize");
const { sequelize } = require("../Config/db.js");

const CommandePack = sequelize.define(
  "CommandePack",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    packId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "En attente" },
  },
  {
    tableName: "commandes_package",
    timestamps: true,
  }
);

module.exports = { CommandePack };
