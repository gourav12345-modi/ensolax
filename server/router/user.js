const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const emailValidation = require('../middleware/emailValidation');
const passwordValidation = require('../middleware/passwordValidation');
const nameValidation = require('../middleware/nameValidation');
// Register user
router.post('/register', nameValidation, emailValidation, passwordValidation, userController.register);
// User login
router.post('/login', emailValidation, userController.login);
// user logout
router.post('/logout', userController.logout);
// getUser Information
router.get('/getUserInfo', auth, userController.getUserInfo);

module.exports = router;
