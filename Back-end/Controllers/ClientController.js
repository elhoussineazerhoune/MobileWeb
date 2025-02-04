const { Client } = require("../Models/Client.js");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Admin } = require("../Models/Admin.js");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createClient = async (req, res) => {
  try {
    const { pspsps } = req.body;
    const salt = 10;
    const code = await bcrypt.hash(pspsps, salt);
    res.json(code);
  } catch (error) {
    res.status(400).json({ message: "oops", error: error });
  }
};

const findAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des clients",
      error: error.message,
    });
  }
};

const findOneClient = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const client = await Client.findByPk(id);
    console.log(client);
    if (client) {
      const infos = {
        customerName: client.nom,
        customerDetails: {
          email: client.email,
          phone: client.contact,
          address: client.adresse,
        }
      };
      res.status(200).json({ success: true, client: infos });
    } else {
      res.status(404).json({ message: "Client non trouvé" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du client",
      error: error.message,
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const clientInfos = req.body.clientInfos;
    console.log(clientInfos.email);
    if (clientInfos.email) {
      const [updated] = await Client.update(clientInfos, {
        attributes: ["email"],
        where: {
          email: clientInfos.email, // Ajoutez une condition ici
        },
      });
      if (updated) {
        res.json({ message: "Client mis à jour avec succès", success: true });
      } else {
        res.status(404).json({ message: "Client non trouvé", success: false });
      }
    } else {
      res.json({ message: "Entrer un Email valide", success: false });
    }
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour du client",
      error,
      success: false,
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: "Client supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Client non trouvé" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du client",
      error: error.message,
    });
  }
};

const findCurrentClient = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const currentid = jwt.verify(id, process.env.JWT_SECRET);
    const ClientExists = await Client.findByPk(currentid.id);
    console.log(ClientExists.nom);
    res.json({
      success: true,
      id: ClientExists.id,
      nom: ClientExists.nom,
      prenom: ClientExists.prenom,
      contact: ClientExists.contact,
      email: ClientExists.email,
      adresse: ClientExists.adresse,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "somthing went wrong in fetching data of user",
    });
  }
};


const loginuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //LOGIN FOR ADMIN
    const admin = await Admin.findOne({ where: { email: email } });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = createToken(admin.id_admin);
        res.json({ success: true, token, admin: true });
      } else {
        res.json({ success: false, message: "invalid email or password" });
      }
    } else {
      //LOGIN FOR CLIENTS
      const client = await Client.findOne({ where: { email: email } });
      if (!client) {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }
      const isMatch = await bcrypt.compare(password, client.password);
      if (!isMatch) {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }
      const token = createToken(client.id);
      res.json({ success: true, token, admin: false });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};
const registeruser = async (req, res) => {
  const { email, password, name, lastname, adresse, contact } = req.body;
  try {
    const exists = await Client.findOne({ where: { email: email } });
    if (exists) {
      return res.json({ success: false, message: "user already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newClient = Client.create({
      nom: name,
      prenom: lastname,
      email: email,
      password: hashedPassword,
      adresse: adresse,
      contact: contact,
    });
    // const client = await newClient.save();
    const token = createToken(newClient.clt_id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required"
      });
    }

    // if (newPassword.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "this password is too short"
    //   });
    // }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const client = await Client.update(
      { password: hashedPassword },
      { where: { id: id } }
    );

    if (client[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message
    });
  }
};

module.exports = {
  findAllClients,
  findOneClient,
  createClient,
  updateClient,
  deleteClient,
  loginuser,
  registeruser,
  findCurrentClient,
  updatePassword,
};
