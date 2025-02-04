const { Sequelize } = require("sequelize");
require("dotenv").config();

// Créer une seule instance de Sequelize pour garantir une connexion unique
class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize(
        process.env.DB_HOST_NAME,
        process.env.HOST_USERNAME,
        process.env.HOST_PASSWORD,
        {
          host: process.env.HOST_HOST,
          dialect: "mysql",
          logging: false,
          port: 3306,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        }
      );
      Database.instance = this;
    }

    return Database.instance;
  }

  // Méthode pour initialiser la connexion à la base de données
  async initializeDatabase() {
    try {
      await this.sequelize.authenticate();
      console.log("Connexion à la base de données réussie !");
      // Vous pouvez décommenter cette ligne pour synchroniser les modèles si nécessaire


      await this.sequelize.sync({ alter: true })
        .then(() => {
          console.log("Database synchronized");
        })
        .catch((error) => {
          console.error("Error synchronizing the database:", error);
        });
      console.log("data base updated");
    } catch (error) {
      console.error("Erreur lors de la connexion à la base de données :", error);
      throw error;
    }
  }

  async closeDatabase() {
    try {
      await this.sequelize.close();
      console.log("Connexion à la base de données fermée !");
    } catch (error) {
      console.error("Erreur lors de la fermeture de la connexion :", error);
      throw error;
    }
  }

  // Accéder à l'instance de Sequelize
  getSequelize() {
    return this.sequelize;
  }
}

module.exports = new Database();
