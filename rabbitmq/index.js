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

const createChannel = async name => {
    try {
        const channel = await _client.createChannel();

        await channel.assertQueue(name);

        return channel;
    } catch (error) {
        console.log('RabbitMQ create channel error: ', error);
    }
};

const publish = async (channel, name, message) => {
    try {
        await channel.sendToQueue(name, Buffer.from(JSON.stringify(message)));

        console.log(`Published to ${name}: `, message);
    } catch (error) {
        console.log('RabbitMQ publish error: ', error);
    }
};

const consume = async (channel, name, callback) => {
    try {
        await channel.consume(name, message => {
            console.log(`Consumed from ${name}: `, message.content.toString());

            callback(message);
        });
    } catch (error) {
        console.log('RabbitMQ consume error: ', error);
    }
};

module.exports = {
    connect,
    disconnect,
    client,
    createChannel,
    publish,
    consume
};