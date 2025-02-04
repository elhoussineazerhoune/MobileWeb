const { DataTypes } = require('sequelize');
const {sequelize} = require('../Config/db.js');

const Categorie = sequelize.define('Categorie', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom_categorie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    maxOrdStock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    LivraisonPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'categories',
});

module.exports = {Categorie};