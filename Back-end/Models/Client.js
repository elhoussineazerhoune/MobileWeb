const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/db.js');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: { type: DataTypes.STRING, allowNull: true },
  prenom: { type: DataTypes.STRING, allowNull: true },
  adresse: { type: DataTypes.STRING, allowNull: true },
  contact: { type: DataTypes.STRING, allowNull: true, unique: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  status : {type: DataTypes.STRING, allowNull: false, defaultValue: "inactif"},
  password : {type: DataTypes.STRING, allowNull: false},
}, {
  tableName: 'clients'
});

module.exports = { Client };