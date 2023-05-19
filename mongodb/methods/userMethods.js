const crypto = require('b-crypto');

module.exports = {
    comparePassword: async function (password) {
        const user = this;

        return await crypto.compare(password, user.password);
    }
};