const httpStatus = require('http-status');
const messages = require('../constants/messages');
const { ErrorResult } = require('../models/results');

module.exports = (req, res, next) => {
    res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.not_found));
};