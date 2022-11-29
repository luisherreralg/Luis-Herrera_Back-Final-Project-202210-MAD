import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserRepository } from '../repositories/user.js';

export const usersRouter = Router();
const controller = new UserController(UserRepository.getInstance());

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
