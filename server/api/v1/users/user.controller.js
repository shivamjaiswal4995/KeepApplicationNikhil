const userService = require('./user.service');

const addUser = function(userObj, done) {
    userService.addUser(userObj, done);
}

const findUser = (userObj, done) => {
    userService.findUser(userObj, done);
}

const userProfile = (userId, done) => {
    userService.userProfile(userId, done);
}

const getAllUsers = (done) => {
    userService.getAllUsers(done);
};


module.exports = {
    addUser,
    findUser,
    userProfile,
    getAllUsers
}