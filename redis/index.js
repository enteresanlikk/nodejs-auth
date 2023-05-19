const redis = require('redis');

let _client = undefined;
const connect = async uri => {
    try {
        const redisClient = redis.createClient({
            url: uri,
        });

        redisClient.on('error', (err) => {
            console.log('Redis error: ', err);
        });

        await redisClient.connect();

        console.log('Connected to Redis');

        _client = redisClient;
    } catch (error) {
        console.log('Redis error: ', error);
    }
};

const disconnect = async () => {
    try {
        await _client.disconnect();

        console.log('Disconnected from Redis');
    } catch (error) {
        console.log('Redis error: ', error);
    }
};

const client = () => _client;

module.exports = {
    connect,
    disconnect,
    client
};