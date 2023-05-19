const jwt = require('jsonwebtoken');

const generate = (payload, secret, options = {}) => {
    return jwt.sign(payload, secret, {
        expiresIn: '60m',
        ...options
    });
};

const verify = (token, secret, options = {}) => {
    return jwt.verify(token, secret, options);
};

module.exports = {
    generate,
    verify
};