const { Token } = require('../models');

const getByUserIdAndType = async (id, type) => await Token.findOne({ userId: id, tokenType: type });
const getByTokenAndType = async (token, type) => await Token.findOne({ token: token, tokenType: type });

const create = async (data) => {
    const token = new Token(data);

    return await token.save();
};

const deleteById = async (id) => {
    return await Token.findByIdAndDelete(id);
};

module.exports = {
    getByUserIdAndType,
    getByTokenAndType,
    create,
    deleteById
};