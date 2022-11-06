import { Router } from "express";
import { UserController } from '../controller/userController'
const userRoutes = Router();
const userController = new UserController()
userRoutes.post('/login', userController.login)
userRoutes.post('/user', userController.create)

export { userRoutes };
