const bcrypt = require('bcrypt');

const create = async (text, saltRound) => {
    const salt = await bcrypt.genSalt(parseInt(saltRound));
    return await bcrypt.hash(text, salt);
};

const compare = async (text, hash) => await bcrypt.compare(text, hash);

module.exports = {
    create,
    compare
};