const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const db = require("./Config/db.js"); // Importer l'instance Singleton de la base de données
const { ArticleRouter } = require("./Routes/ArticleRoute.js");
const { ClientRouter } = require("./Routes/ClientRoute.js");
const { CommandeRouter } = require("./Routes/CommandeRoute.js");
const { AdminRouter } = require("./Routes/AdminRoute.js");
const { CategorieRouter } = require("./Routes/CategorieRoute.js");
const { PackRouter } = require("./Routes/PackRoute.js");
const { commandePackRouter } = require("./Routes/CommandePackRoute.js");
const { SystemRouter } = require("./Routes/SystemInfoRoute.js");

const app = express();

// Charger les variables sensibles depuis le fichier .env
const PORT = process.env.PORT || 3000;
const allowedOrigin = process.env.ALLOWED_ORIGIN;

// Middlewares globaux
app.use(express.json());
// app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(
  cors({
    origin: ["https://iqrae-librairie.vercel.app", "http://localhost:5173"], // Add your frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
); // Limiter les origines
app.use("/images", express.static("./Uploads")); // Servir les fichiers statiques
app.use(helmet()); // Ajouter des en-têtes de sécurité

// Middleware pour vérifier l'origine
// app.use((req, res, next) => {
//   if (req.headers.origin !== allowedOrigin) {
//     return res.status(403).send('Accès refusé');
//   }
//   next();
// });

// Ajouter des en-têtes de réponse pour renforcer la sécurité
// app.use((req, res, next) => {
//   res.setHeader('X-Content-Type-Options', 'nosniff');
//   res.setHeader('X-Frame-Options', 'DENY');
//   res.setHeader('Content-Security-Policy', "default-src 'self'");
//   next();
// });

// Routes
app.use("/api/article", ArticleRouter);
app.use("/api/client", ClientRouter);
app.use("/api/commande", CommandeRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/categories", CategorieRouter);
app.use("/api/pack", PackRouter);
app.use("/api/commandepackage", commandePackRouter);
app.use("/api/sysinfos", SystemRouter);

// Fonction pour démarrer le serveur
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

db.initializeDatabase()
  .then(() => startServer())
  .catch((error) => {
    console.error("Erreur lors de l'initialisation de l'application :", error);
    process.exit(1); // Arrêter l'application en cas d'échec critique
  });
