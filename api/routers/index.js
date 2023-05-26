const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = require('./authRouter');
const taskRouter = require('./taskRouter');

router.use('/auth', authRouter);
router.use('/tasks', authMiddleware, taskRouter);

module.exports = router;