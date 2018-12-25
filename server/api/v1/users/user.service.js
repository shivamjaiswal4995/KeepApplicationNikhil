const userDAO = require('./user.dao');

const addUser = (userObj, done) => {
    userDAO.addUser(userObj, done);
}

const findUser = (userObj, done) => {
    userDAO.findUser(userObj, done);
}

const userProfile = (userId, done) => {
    userDAO.userProfile(userId, done);
}

const getAllUsers = (done) => {
    userDAO.getAllUsers(done);
};

module.exports = {
    addUser,
    findUser,
    userProfile,
    getAllUsers
}