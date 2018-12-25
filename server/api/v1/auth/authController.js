const config = require('../../../config');
const verifyToken = require('../JWT').verifyToken;
const logger = require('../../../logger');

const isAuthenticated = (req, res, next) => {
    // checking the presence of token on request header
    let errorObj = {
        isAuthenticated: false
    }
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        verifyToken(token, config.secret, (err, verifiedToken) => {
            if(err) {
                if(config.logging) {
                    logger.error("Error occurred while verifying the token: ", err);
                }
                return res.status(200).json(errorObj);
            } else {      
                // console.log(`token is ${JSON.stringify(verifiedToken)}`);  
                req.userId = verifiedToken.userId;
                next();
            }
        });
    } else {
        return res.status(403).json(errorObj);
    }
};

module.exports = isAuthenticated;