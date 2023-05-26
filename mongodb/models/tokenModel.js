const mongoose = require('mongoose');
const { TOKEN_TYPES } = require('../constants');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true
    },
    tokenType: {
        type: String,
        enum: [TOKEN_TYPES.FORGOT_PASSWORD, TOKEN_TYPES.VERIFY_EMAIL],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 60 // 30 minutes
    }
}, { versionKey: false });

module.exports = mongoose.model('token', tokenSchema);