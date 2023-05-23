const httpStatus = require('http-status');
const { services: { UserService } } = require('b-mongodb');
const rabbitmq = require('b-rabbitmq');
const token = require('b-token');
const messages = require('../constants/messages');
const { ErrorResult, SuccessDataResult, SuccessResult} = require('../models/results');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await UserService.getByEmailAndPassword(email, password);

        if (!user) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.not_found));

        // TODO: token service add
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

        // TODO: token service add
        const verifyEmailToken = token.generate({
            id: newUser._id
        }, process.env.TOKEN_SECRET, { expiresIn: '15m' });

        rabbitmq.queues.verifyEmail.publish({
            email: newUser.email,
            link: `${process.env.APP_DOMAIN}/api/auth/verify-email?token=${verifyEmailToken}`,
        });

        return res.status(httpStatus.CREATED).json(new SuccessResult(messages.user.success_created));
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        const user = await UserService.getByEmail(email);

        if (user) {
            // TODO: token service add
            const verifyEmailToken = token.generate({
                id: user._id
            }, process.env.TOKEN_SECRET, { expiresIn: '15m' });

            rabbitmq.queues.forgotPassword.publish({
                email: user.email,
                link: `${process.env.APP_DOMAIN}/api/auth/reset-password?token=${verifyEmailToken}`,
            });
        }

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.send_reset_password_link));
    },
    resetPassword: async (req, res) => {
        const { password } = req.body;
        const user = req.user;

        const updatedUser = await UserService.update(user.id, { password });

        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_password_updated));

        rabbitmq.queues.resetPassword.publish({
            email: updatedUser.email
        });

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.password_updated));
    },
    sendVerifyEmail: async (req, res) => {
        const { id } = req.user;

        const user = await UserService.getById(id);
        if(user && !user.isEmailVerified) {
            // TODO: token service add
            const verifyEmailToken = token.generate({
                id: user._id
            }, process.env.TOKEN_SECRET, { expiresIn: '15m' });

            rabbitmq.queues.verifyEmail.publish({
                email: user.email,
                link: `${process.env.APP_DOMAIN}/api/auth/verify-email?token=${verifyEmailToken}`,
            });
        }

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.send_verify_email));
    },
    verifyEmail: async (req, res) => {
        const user = req.user;

        const updatedUser = await UserService.update(user.id, { isEmailVerified: true });

        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).json(new ErrorResult(messages.user.error_email_verified));

        return res.status(httpStatus.OK).json(new SuccessResult(messages.user.email_verified));
    }
};