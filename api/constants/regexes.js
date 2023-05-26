const { TASK_STATUS } = require('b-mongodb/constants');

module.exports = {
    password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[_\\.\\?\\+\\&])[A-Za-z\\d_\\.\\?\\+\\&]{8,}$',
    task: {
        status: `^(${Object.values(TASK_STATUS).join('|')})$`
    }
};