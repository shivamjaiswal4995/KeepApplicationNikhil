/* Replace undefined with the method or function reference, which signs the token with given payload, expiry time and secret, call back should have error or signed token */
const signJWTToken = require('./api/v1/JWT').signToken;

/* Replace undefined with the method or function reference, which verifies a given JWT Token and callback with error & payload */
const verifyJWTToken = require('./api/v1/JWT').verifyToken;

module.exports = {
	signJWTToken,
	verifyJWTToken
}