import { Router } from 'express';

export const ordersRouter = Router();
const controller = new OrderController(OrderRepository.getInstance());

ordersRouter.get('/cart/:userId', controller.getCart.bind(controller));
ordersRouter.post('/', controller.newOrder.bind(controller));
ordersRouter.delete(
    '/delete/:userId/:itemId',
    controller.deleteOrder.bind(controller)
);
