const bcrypt = require('bcrypt');

const HASH_SALT = 10;

const hashPassword = (password) => bcrypt.hashSync(password, HASH_SALT);
const validatePassword = (testedPassword, hash) => bcrypt.compareSync(testedPassword, hash);

module.exports = { hashPassword, validatePassword };