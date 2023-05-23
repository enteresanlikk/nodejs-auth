const express = require('express');
const authController = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const authValidation = require('../validations/authValidation');
const errorHandler = require('../utils/errorUtil');
const router = express.Router();

router.post('/login', authValidation.login, validationMiddleware, errorHandler(authController.login));
router.post('/register', authValidation.register, validationMiddleware, errorHandler(authController.register));

router.post('/forgot-password', authValidation.forgotPassword, validationMiddleware, errorHandler(authController.forgotPassword));
router.post('/reset-password', authMiddleware, authValidation.resetPassword, validationMiddleware, errorHandler(authController.resetPassword));

router.get('/verify-email', authMiddleware, errorHandler(authController.verifyEmail));
router.post('/verify-email', authMiddleware, errorHandler(authController.sendVerifyEmail));

module.exports = router;