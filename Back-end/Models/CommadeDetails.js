const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/db.js');


const CommandeDetail = sequelize.define('CommandeDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    commandeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'commandes', // Nom de la table des commandes
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'articles', // Nom de la table des articles
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // prixUnitaire: {
    //     type: DataTypes.DOUBLE,
    //     allowNull: false
    // },
    totalLigne: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
},
    {
        tableName: 'commandeDetail',
        timestamps: true
    })

module.exports = { CommandeDetail };