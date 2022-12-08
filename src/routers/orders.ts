import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { logged } from '../middlewares/interceptors.js';
import { OrderRepository } from '../repositories/order.js';
import { SneakerRepository } from '../repositories/sneaker.js';
import { UserRepository } from '../repositories/user.js';

export const ordersRouter = Router();
const controller = new OrderController(
    OrderRepository.getInstance(),
    SneakerRepository.getInstance(),
    UserRepository.getInstance()
);

ordersRouter.get('/cart', logged, controller.getCart.bind(controller));

ordersRouter.post(
    '/newOrder/:itemId',
    logged,
    controller.newOrder.bind(controller)
);

ordersRouter.patch(
    '/updateOrder/:itemId',
    logged,
    controller.updateOrder.bind(controller)
);

ordersRouter.delete(
    '/delete/:itemId',
    logged,
    controller.deleteOrder.bind(controller)
);
