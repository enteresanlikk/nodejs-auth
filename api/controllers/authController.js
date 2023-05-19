const httpStatus = require('http-status');
const { services: { UserService } } = require('b-mongodb');
const token = require('b-token');
const messages = require('../constants/messages');
const { ErrorResult, SuccessDataResult, SuccessResult} = require('../models/results');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await UserService.getByEmailAndPassword(email, password);

        if (!user) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.not_found));

        if(!user.isEmailVerified) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.user.email_not_verified));

        const tokenData = token.generate({
            id: user._id
        }, process.env.JWT_SECRET);

        // TODO: Send login email notification

        return res.status(httpStatus.OK).json(new SuccessDataResult({ token: tokenData }, messages.user.found));
    },
    register: async (req, res) => {
        const { email, password } = req.body;

        const user = await UserService.getByEmail(email);

        if (user) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.user.already_exists));

        const newUser = await UserService.create({ email, password });

        if (!newUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_created));

        // TODO: Send email verification
        // 15 minutes expiration

        return res.status(httpStatus.CREATED).json(new SuccessResult(messages.user.success_created));
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        const user = await UserService.getByEmail(email);

        if (user) {
            // TODO: Send reset password link
            // 15 minutes expiration
        }

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.send_reset_password_link));
    },
    resetPassword: async (req, res) => {
        const { password } = req.body;
        const user = req.user;

        const updatedUser = await UserService.update(user.id, { password });

        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_password_updated));

        // TODO: Send change password notification

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.password_updated));
    },
    verifyEmail: async (req, res) => {
        const user = req.user;
        // TODO: Verify email
    }
};