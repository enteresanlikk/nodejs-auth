const { check } = require('express-validator');
const messages = require('../constants/validationMessages');

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
                .withMessage(messages.password.is_required),
        check('confirmPassword')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .custom((value, {req}) => value === req.body.password)
                .withMessage(messages.password.not_match)
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
                .withMessage(messages.password.is_required),
        check('confirmPassword')
            .not()
            .isEmpty()
                .withMessage(messages.password.is_required)
            .custom((value, {req}) => value === req.body.password)
                .withMessage(messages.password.not_match)
    ]
};

module.exports = authValidation;