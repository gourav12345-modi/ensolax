const router = require('express').Router();
import * as userController from "../controllers/userController"
import auth from "../middleware/auth"
import emailValidation from '../middleware/emailValidation'
import passwordValidation from '../middleware/passwordValidation'
import nameValidation from '../middleware/nameValidation'

// Register user
router.post('/register', nameValidation, emailValidation, passwordValidation, userController.register);
// User login
router.post('/login', emailValidation, userController.login);
// user logout
router.post('/logout', userController.logout);
// getUser Information
router.get('/getUserInfo', auth, userController.getUserInfo);

export default router;
