const jwt = require('jsonwebtoken');

module.exports = {
    getAttribute: function(token) {
        return jwt.decode(token, "secret2137");
    }
}