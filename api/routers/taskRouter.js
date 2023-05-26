const express = require('express');
const taskController = require('../controllers/taskController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const taskValidation = require('../validations/taskValidation');
const errorHandler = require('../utils/errorUtil');
const router = express.Router();

router.get('/', errorHandler(taskController.getAll));
router.get('/:id', errorHandler(taskController.getById));

router.post('/', taskValidation.create, validationMiddleware, errorHandler(taskController.create));
router.put('/:id', taskValidation.update, validationMiddleware, errorHandler(taskController.update));
router.delete('/:id', errorHandler(taskController.deleteById));

module.exports = router;