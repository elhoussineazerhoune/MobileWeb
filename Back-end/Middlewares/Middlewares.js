const jwt = require("jsonwebtoken");
const { Client } = require('../Models/Client');
const { Admin } = require('../Models/Admin');


const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not authorized login again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
function checkRoles(allowedRoles) {
    return async (req, res, next) => {
        const {token} = req.body;
        if (!token) {
            return res.json({ success: false, message: "no token axists" });
        }
        try {
            let role = "";
            const token_decode = jwt.verify(token, process.env.JWT_SECRET);

            const isAdmin = await Admin.findByPk(token_decode.id);
            const isClient = await Client.findByPk(token_decode.id);
            if (isAdmin) {
                role = "Admin";
            } else if (isClient) {
                role = "Client";
            } else {
                role = "";
            }
            if (allowedRoles.includes(role)) {
                next();
            } else {
                return res.json({ success: false, message: "access denied !" });
            }

        } catch (error) {
            console.log("error");
            return res.json({ success: false, error });

        }
    };
}

module.exports = { authMiddleware, checkRoles };
