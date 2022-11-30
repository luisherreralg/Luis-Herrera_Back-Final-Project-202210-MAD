import { Router } from 'express';

export const ordersRouter = Router();
const controller = new OrderController(OrderRepository.getInstance());

// ordersRouter.post('/register', controller.register.bind(controller));
// ordersRouter.post('/login', controller.login.bind(controller));
