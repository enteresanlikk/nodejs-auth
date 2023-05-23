const crypto = require('b-crypto');

module.exports = {
    save: async function (next) {
        const user = this;

        user.password = await crypto.create(user.password, process.env.CRYPTO_SALT_ROUNDS);

        return next();
    },
    findOneAndUpdate: async function (next) {
        const user = this._update;

        if (user.password) {
            user.password = await crypto.create(user.password, process.env.CRYPTO_SALT_ROUNDS);
        }

        return next();
    }
};