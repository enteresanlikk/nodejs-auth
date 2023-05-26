const { check } = require('express-validator');
const messages = require('../constants/validationMessages');
const regexes = require('../constants/regexes');

const authValidation = {
    create: [
        check('title')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Title')),
        check('description')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Description')),
        check('status')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Status'))
            .matches(regexes.task.status)
                .withMessage(messages.task.status_not_valid)
    ],
    update: [
        check('title')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Title')),
        check('description')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Description')),
        check('status')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Status'))
            .matches(regexes.task.status)
                .withMessage(messages.task.status_not_valid)
    ]
};

module.exports = authValidation;