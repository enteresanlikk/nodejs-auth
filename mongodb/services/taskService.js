const { Task} = require('../models');

const getAll = async (userId) => await Task.find({ userId });

const getById = async (userId, id) => await Task.findOne({ userId, _id: id });

const create = async (data) => {
    const task = new Task(data);

    return await task.save();
};

const update = async (userId, id, payload) => await Task.findOneAndUpdate({ userId, _id: id }, payload, { new: true });

const deleteById = async (userId, id) => await Task.findOneAndRemove({ userId, _id: id });

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};