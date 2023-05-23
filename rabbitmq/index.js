const amqplib = require('amqplib');
const email = require('b-email');

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

const createQueue = async (client, name) => {
    try {
        const channel = await client.createChannel();

        await channel.assertQueue(name);

        return channel;
    } catch (error) {
        console.log('RabbitMQ create channel error: ', error);
    }
};

const publish = async (channel, name, message) => {
    try {
        await channel.sendToQueue(name, Buffer.from(JSON.stringify(message)));
    } catch (error) {
        console.log('RabbitMQ publish error: ', error);
    }
};

const consume = async (channel, name, callback) => {
    try {
        await channel.consume(name, message => callback(message));
    } catch (error) {
        console.log('RabbitMQ consume error: ', error);
    }
};

const queues = {
    loginNotification: {
        name: 'loginNotification',
        channel: undefined,
        setup: async function ()  {
            this.channel = await createQueue(_client, this.name);

            await consume(this.channel, this.name, message => this.consume(message));
        },
        consume: async function (message) {
            const data = JSON.parse(message.content.toString());

            const emailBody = `<p>Login notification from <b>${data.ip}</b> at <b>${data.date.toString('')}</b> using <b>${data.userAgent}</b></p>`;
            await email.send(data.email, 'Login Notification', emailBody);

            this.channel.ack(message);
        },
        publish: async function (message) {
            await publish(this.channel, this.name, message);
        }
    },
    verifyEmail: {
        name: 'verifyEmail',
        channel: undefined,
        setup: async function ()  {
            this.channel = await createQueue(_client, this.name);

            await consume(this.channel, this.name, message => this.consume(message));
        },
        consume: async function (message) {
            const data = JSON.parse(message.content.toString());

            const emailBody = `<p>Verify your email address by pasting in postman <b>${data.link}</b></p>`;
            await email.send(data.email, 'Verify Email', emailBody);

            this.channel.ack(message);
        },
        publish: async function (message) {
            await publish(this.channel, this.name, message);
        }
    },
    forgotPassword: {
        name: 'forgotPassword',
        channel: undefined,
        setup: async function ()  {
            this.channel = await createQueue(_client, this.name);

            await consume(this.channel, this.name, message => this.consume(message));
        },
        consume: async function (message) {
            const data = JSON.parse(message.content.toString());

            const emailBody = `<p>Reset your password by pasting in postman <b>${data.link}</b></p>`;
            await email.send(data.email, 'Forgot Password', emailBody);

            this.channel.ack(message);
        },
        publish: async function (message) {
            await publish(this.channel, this.name, message);
        }
    },
    resetPassword: {
        name: 'resetPassword',
        channel: undefined,
        setup: async function ()  {
            this.channel = await createQueue(_client, this.name);

            await consume(this.channel, this.name, message => this.consume(message));
        },
        consume: async function (message) {
            const data = JSON.parse(message.content.toString());

            const emailBody = `<p>Your password has been reset successfully</p>`;
            await email.send(data.email, 'Reset Password', emailBody);

            this.channel.ack(message);
        },
        publish: async function (message) {
            await publish(this.channel, this.name, message);
        }
    }
};

const run = async () => {
    const keys = Object.keys(queues);

    for (let i = 0; i < keys.length; i++) {
        const queue = queues[keys[i]];

        await queue.setup();
    }
};

module.exports = {
    connect,
    disconnect,
    client,
    run,
    queues
};