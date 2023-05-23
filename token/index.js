const jwt = require('jsonwebtoken');

const generate = (payload, secret, options = {}) => {
    return jwt.sign(payload, secret, {
        expiresIn: '60m',
        ...options
    });
};

const verify = (token, secret, options = {}) => {
    try {
        return jwt.verify(token, secret, options);
    } catch (error) {
        return false;
    }
};

module.exports = {
    generate,
    verify
};