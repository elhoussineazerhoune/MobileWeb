const { DataTypes } = require("sequelize");
const { sequelize } = require("../Config/db.js");

const SystemeInfos = sequelize.define(
  "SystemeInfos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "systemeInfos",
  }
);

module.exports = { SystemeInfos };
