import { Router } from 'express';

export const usersRouter = Router();
const controller = new UserController(UserRepository.getInstance());

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
