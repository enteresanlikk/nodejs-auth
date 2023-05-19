require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// project dependencies
const mongodb = require('mongodb');
const redis = require('redis');
const rabbitmq = require('rabbitmq');

const {
    APP_PORT,
    APP_HOST,
    MONGODB_URI,
    REDIS_URI,
    RABBITMQ_URI
} = process.env;
const app = express();
const routers = require('./routers');
const appPort = APP_PORT || 3030;
const appHost = APP_HOST || '127.0.0.1';

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 500
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routers);

app.set('port', appPort);
app.set('host', appHost);
app.listen(appPort, async () => {
    if(REDIS_URI) await redis.connect(REDIS_URI);
    if(RABBITMQ_URI) await rabbitmq.connect(RABBITMQ_URI);
    if(MONGODB_URI) await mongodb.connect(MONGODB_URI);

    console.log(`Api is running on ${appHost}:${appPort}`);
});

module.exports = app;