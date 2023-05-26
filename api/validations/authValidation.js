const { check } = require('express-validator');
const messages = require('../constants/validationMessages');
const regexes = require('../constants/regexes');

const authValidation = {
    login: [
        check('email')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Email'))
            .isEmail()
                .withMessage(messages.not_valid('Email')),
        check('password')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Password'))
            .matches(regexes.password)
                .withMessage(messages.password.not_valid('Password'))
    ],
    register: [
        check('email')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Email'))
            .isEmail()
                .withMessage(messages.not_valid('Email')),
        check('password')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Password'))
            .matches(regexes.password)
                .withMessage(messages.password.not_valid('Password')),
        check('confirmPassword')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Confirm password'))
            .custom((value, {req}) => value === req.body.password)
                .withMessage(messages.password.not_match)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid('Confirm password'))
    ],
    forgotPassword: [
        check('email')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Email'))
            .isEmail()
                .withMessage(messages.not_valid('Email'))
    ],
    resetPassword: [
        check('password')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Password'))
            .matches(regexes.password)
                .withMessage(messages.password.not_valid('Password')),
        check('confirmPassword')
            .trim()
            .not()
            .isEmpty()
                .withMessage(messages.is_required('Confirm password'))
            .custom((value, {req}) => value === req.body.password)
                .withMessage(messages.password.not_match)
            .matches(regexes.password)
                .withMessage(messages.password.not_valid('Confirm password'))
    ]
};

module.exports = authValidation;