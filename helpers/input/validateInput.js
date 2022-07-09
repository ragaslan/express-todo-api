const CustomError = require("../errors/CustomError");
const bcrypt = require("bcryptjs");

const comparePassword = (password,hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

const validateLoginInputs = (username,password) => {
    return username && password;
}
const validateTodoInputs = (title,detail) => {
    return title && detail;
}
module.exports = {
    comparePassword,
    validateLoginInputs,
    validateTodoInputs
}