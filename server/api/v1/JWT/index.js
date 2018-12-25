const JWT = require('./jwtController');

module.exports = {
    signToken: JWT.signToken,
    verifyToken: JWT.verifyToken
}