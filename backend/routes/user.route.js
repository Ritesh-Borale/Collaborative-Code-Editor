import { Router } from 'express'
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware  from '../middlewares/user.middleware.js'

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage("Email must be valid email"),
    body('password').isLength({ min: 3 }).withMessage("password should be more than 3 characters"),

    userController.signupController
);

router.post('/login',userController.loginController)

router.get('/profile',authMiddleware.authUser,userController.profileController);
router.get('/logout',authMiddleware.authUser,userController.logoutController);
router.get('/all', authMiddleware.authUser, userController.getAllUsersController);
export default router;