const httpStatus = require('http-status');
const crypto = require('crypto');
const { services: { UserService, TokenService }, constants: { TOKEN_TYPES } } = require('b-mongodb');
const rabbitmq = require('b-rabbitmq');
const token = require('b-token');
const messages = require('../constants/messages');
const { ErrorResult, SuccessDataResult, SuccessResult} = require('../models/results');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await UserService.getByEmailAndPassword(email, password);

        if (!user) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.not_found));

        const tokenData = token.generate({
            id: user._id
        }, process.env.TOKEN_SECRET);

        rabbitmq.queues.loginNotification.publish({
            email: user.email,
            date: new Date(),
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        return res.status(httpStatus.OK).json(new SuccessDataResult({ token: tokenData }, messages.user.found));
    },
    register: async (req, res) => {
        const { email, password } = req.body;

        const user = await UserService.getByEmail(email);

        if (user) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.user.already_exists));

        const newUser = await UserService.create({ email, password });

        if (!newUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_created));

        return res.status(httpStatus.CREATED).json(new SuccessResult(messages.user.success_created));
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        const user = await UserService.getByEmail(email);

        if (user) {
            let token = await TokenService.getByUserIdAndType(user._id, TOKEN_TYPES.FORGOT_PASSWORD);
            if(!token) {
                token = await TokenService.create({
                    userId: user._id,
                    token: crypto.randomBytes(64).toString('hex'),
                    tokenType: TOKEN_TYPES.FORGOT_PASSWORD
                });
            }

            rabbitmq.queues.forgotPassword.publish({
                email: user.email,
                link: `${process.env.APP_DOMAIN}/api/auth/reset-password/${token.token}`,
            });
        }

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.send_reset_password_link));
    },
    resetPassword: async (req, res) => {
        const { password } = req.body;
        const { token } = req.params;

        const tokenData = await TokenService.getByTokenAndType(token, TOKEN_TYPES.FORGOT_PASSWORD);
        if (!tokenData) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.token_not_found));

        const updatedUser = await UserService.update(tokenData.userId, { password });

        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_password_updated));

        await TokenService.deleteById(tokenData._id);

        rabbitmq.queues.resetPassword.publish({
            email: updatedUser.email
        });

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.password_updated));
    },
    sendVerifyEmail: async (req, res) => {
        const { id } = req.user;

        const user = await UserService.getById(id);
        if(user && !user.isEmailVerified) {
            let token = await TokenService.getByUserIdAndType(user._id, TOKEN_TYPES.VERIFY_EMAIL);
            if(!token) {
                token = await TokenService.create({
                    userId: user._id,
                    token: crypto.randomBytes(64).toString('hex'),
                    tokenType: TOKEN_TYPES.VERIFY_EMAIL
                });
            }

            rabbitmq.queues.verifyEmail.publish({
                email: user.email,
                link: `${process.env.APP_DOMAIN}/api/auth/verify-email/${token.token}`,
            });
        }

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.send_verify_email));
    },
    verifyEmail: async (req, res) => {
        const { token } = req.params;

        const tokenData = await TokenService.getByTokenAndType(token, TOKEN_TYPES.VERIFY_EMAIL);
        if (!tokenData) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.token_not_found));

        const user = await UserService.getById(tokenData.userId);
        if (!user) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.not_found));

        if (user.isEmailVerified) return res.status(httpStatus.BAD_REQUEST).json(new ErrorResult(messages.user.email_already_verified));

        const updatedUser = await UserService.update(user._id, { isEmailVerified: true });

        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_email_verified));

        await TokenService.deleteById(tokenData._id);

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.email_verified));
    }
};