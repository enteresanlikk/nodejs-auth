const httpStatus = require('http-status');
const { services: { TaskService } } = require('b-mongodb');
const messages = require('../constants/messages');
const { ErrorResult, SuccessDataResult, SuccessResult} = require('../models/results');

module.exports = {
    getAll: async (req, res) => {
        const userId = req.user.id;

        const items = await TaskService.getAll(userId);
        if(items.length === 0) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.tasks.not_found));

        return res.status(httpStatus.OK).json(new SuccessDataResult(items, messages.tasks.found));
    },
    getById: async (req, res) => {
        const userId = req.user.id;
        const taskId = req.params.id;

        const item = await TaskService.getById(userId, taskId);
        if(!item) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.task.not_found));

        return res.status(httpStatus.OK).json(new SuccessDataResult(item, messages.task.found));
    },
    create: async (req, res) => {
        const userId = req.user.id;
        const { title, description, status } = req.body;

        const item = await TaskService.create({
            userId,
            title,
            description,
            status
        });
        if(!item) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.task.error_created));

        return res.status(httpStatus.CREATED).json(new SuccessDataResult(item, messages.task.success_created));
    },
    update: async (req, res) => {
        const userId = req.user.id;
        const taskId = req.params.id;
        const { title, description, status } = req.body;

        const taskItem = await TaskService.getById(userId, taskId);
        if(!taskItem) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.task.not_found));

        const item = await TaskService.update(userId, taskId, {
            userId,
            title,
            description,
            status
        });
        if(!item) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.task.error_updated));

        return res.status(httpStatus.OK).json(new SuccessDataResult(item, messages.task.success_updated));
    },
    deleteById: async (req, res) => {
        const userId = req.user.id;
        const taskId = req.params.id;

        const taskItem = await TaskService.getById(userId, taskId);
        if(!taskItem) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.task.not_found));

        const status = await TaskService.deleteById(userId, taskId);
        if(!status) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.task.error_deleted));

        return res.status(httpStatus.OK).json(new SuccessResult(messages.task.success_deleted));
    }
};