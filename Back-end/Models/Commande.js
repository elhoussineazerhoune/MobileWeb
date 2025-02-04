const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/db.js');

const Commande = sequelize.define('Commande', {
     id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
     },
     clientId: { type: DataTypes.INTEGER, allowNull: false },
     prixTotal: { type: DataTypes.DOUBLE, allowNull: false },
     status: { type: DataTypes.STRING, defaultValue: "En attente" },
     paymentMethod: { type: DataTypes.STRING, allowNull: false },
}, {
     tableName: 'commandes'
})

module.exports = { Commande };