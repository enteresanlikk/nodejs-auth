const mongoose = require('mongoose');
const { TASK_STATUS } = require('../constants');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(TASK_STATUS),
        default: TASK_STATUS.IN_PROGRESS
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('task', taskSchema);