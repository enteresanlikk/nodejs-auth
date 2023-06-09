const mongoose = require('mongoose');
const services = require('./services');
const constants = require('./constants');

const connect = async uri => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('MongoDB error: ', error);
    }
};

module.exports = {
    connect,
    services,
    constants
};