const { check } = require('express-validator');
const messages = require('../constants/validationMessages');
const regexes = require('../constants/regexes');

const authValidation = {
    login: [
        check('email')
            .not()
            .isEmpty()
                .withMessage(messages.email.is_required)
            .isEmail()
                .withMessage(messages.email.not_valid),
        check('password')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid)
    ],
    register: [
        check('email')
            .not()
            .isEmpty()
                .withMessage(messages.email.is_required)
            .isEmail()
                .withMessage(messages.email.not_valid),
        check('password')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid),
        check('confirmPassword')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .custom((value, {req}) => value === req.body.password)
                .withMessage(messages.password.not_match)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid)
    ],
    forgotPassword: [
        check('email')
            .not()
            .isEmpty()
                .withMessage(messages.email.is_required)
            .isEmail()
                .withMessage(messages.email.not_valid)
    ],
    resetPassword: [
        check('password')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid),
        check('confirmPassword')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .custom((value, {req}) => value === req.body.password)
                .withMessage(messages.password.not_match)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid)
    ]
};

module.exports = authValidation;