const httpStatus = require('http-status');
const token = require('b-token');
const messages = require('../constants/messages');
const { ErrorResult } = require('../models/results');

module.exports = (req, res, next) => {
    const headerToken = req.headers['authorization'];
    const queryToken = req.query.token;

    let tokenData = queryToken;
    if (headerToken) {
        tokenData = headerToken && headerToken.split(' ')[1];
    }

    if (tokenData == null) return res.status(httpStatus.UNAUTHORIZED).json(new ErrorResult(messages.auth.unauthorized));

    const user = token.verify(tokenData, process.env.JWT_SECRET);

    if (!user) return res.status(httpStatus.UNAUTHORIZED).json(new ErrorResult(messages.auth.unauthorized));

    req.user = user;

    next();
};