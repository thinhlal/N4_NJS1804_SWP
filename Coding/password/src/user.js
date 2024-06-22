const { hashPassword } = require('./utils');

let users = [];

const createUser = async (username, password) => {
    const hashedPassword = await hashPassword(password);
    const user = { username, password: hashedPassword };
    users.push(user);
    return user;
};

const getUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

// Hàm để reset users trong môi trường test
const resetUsers = () => {
    users = [];
};

module.exports = { createUser, getUserByUsername, resetUsers };
