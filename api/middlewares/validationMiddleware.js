const { validationResult } = require('express-validator');
const httpStatus = require('http-status');
const messages = require('../constants/validationMessages');
const { ValidationErrorResult } = require('../models/results');

module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = errors.array({ onlyFirstError: true }).map((error) => ({
        field: error.path,
        message: error.msg
    }))

    return res
        .status(httpStatus.BAD_REQUEST)
        .json(new ValidationErrorResult(extractedErrors, messages.error));
};