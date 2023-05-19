const httpStatus = require('http-status');
const messages = require('../constants/messages');
const { ErrorResult } = require('../models/results');

module.exports = (error, req, res, next) => {
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || messages.internal_server_error;

    res.status(status).json(new ErrorResult(message));
};