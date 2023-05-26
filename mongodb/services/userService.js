const { User } = require('../models');

const getAll = async () => await User.find();
const getById = async (id) => await User.findById(id);

const getByEmail = async (email) => await User.findOne({ email });

const getByEmailAndPassword = async (email, password) => {
    const user = await getByEmail(email);

    if (!user) return null;

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return null;

    return user;
};

const create = async (data) => {
    const user = new User(data);

    return await user.save();
};

const update = async (id, payload) => await User.findByIdAndUpdate(id, payload, { new: true })

module.exports = {
    getAll,
    getById,
    getByEmail,
    getByEmailAndPassword,
    create,
    update
};