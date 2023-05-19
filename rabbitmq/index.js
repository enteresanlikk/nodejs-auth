const amqplib = require('amqplib');

let _client = undefined;
const connect = async uri => {
    try {
        const rabbitmqClient = await amqplib.connect(uri);

        console.log('Connected to RabbitMQ');

        _client = rabbitmqClient;
    } catch (error) {
        console.log('RabbitMQ error: ', error);
    }
};

const disconnect = async () => {
    try {
        await _client.close();

        console.log('Disconnected from RabbitMQ');
    } catch (error) {
        console.log('RabbitMQ error: ', error);
    }
};

const client = () => _client;

module.exports = {
    connect,
    disconnect,
    client
};