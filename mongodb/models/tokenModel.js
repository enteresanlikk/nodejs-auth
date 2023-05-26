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
        required: true,
        enum: Object.values(TOKEN_TYPES)
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 60 // 30 minutes
    }
}, { versionKey: false });

module.exports = mongoose.model('token', tokenSchema);