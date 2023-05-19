const { User } = require('../models');

const getAll = async () => await User.find();
const getById = async (id) => await User.findById(id);

module.exports = {
    getAll,
    getById
};