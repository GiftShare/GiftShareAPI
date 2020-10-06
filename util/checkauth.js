const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, "secret2137");
        req.userData = decoded;
        next();
    } catch(err) {
        return res.status(401).json({
            "result": "Błąd logowania"
        });
    }
};