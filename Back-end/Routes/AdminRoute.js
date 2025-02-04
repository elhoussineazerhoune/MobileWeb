const express = require("express");
const {
  getAdmin,
  getWeekInformations,
  getBarGraphData,
  loginAdmin,
  verifyCurrentUser,
  deleteClient,
  getClientStatistics,
  getProductsStatistics,
  updateAdminPassword
} = require("../Controllers/AdminController.js");
const AdminRouter = express.Router();

AdminRouter.get("/", getAdmin);
AdminRouter.post("/login", loginAdmin);
AdminRouter.get("/statistics", getWeekInformations);
AdminRouter.get("/barGraphData", getBarGraphData);
AdminRouter.get("/clientStatistics", getClientStatistics);
AdminRouter.get("/productStatistics", getProductsStatistics);
AdminRouter.post("/verify", verifyCurrentUser);
AdminRouter.post("/deleteclient", deleteClient);
AdminRouter.put('/update-password',updateAdminPassword);

module.exports = { AdminRouter };
