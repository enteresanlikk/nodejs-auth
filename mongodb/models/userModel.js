const mongoose = require('mongoose');
const userHooks = require('../hooks/userHooks');
const userMethods = require('../methods/userMethods');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, { versionKey: false, timestamps: true });

userSchema.pre('save', userHooks.save);
userSchema.pre('findOneAndUpdate', userHooks.findOneAndUpdate);

userSchema.methods.comparePassword = userMethods.comparePassword;

module.exports = mongoose.model('user', userSchema);