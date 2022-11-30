import { Router } from 'express';
import { SneakerController } from '../controllers/sneaker.controller.js';
import { checkRole, logged } from '../middlewares/interceptors.js';
import { SneakerRepository } from '../repositories/sneaker.js';

export const sneakersRouter = Router();
const controller = new SneakerController(SneakerRepository.getInstance());

sneakersRouter.get('/', controller.getAll.bind(controller));
sneakersRouter.get('/:id', controller.get.bind(controller));
sneakersRouter.get('/search/:query', controller.search.bind(controller));
sneakersRouter.post('/', logged, checkRole, controller.post.bind(controller));
sneakersRouter.patch(
    '/:id',
    logged,
    checkRole,
    controller.patch.bind(controller)
);
sneakersRouter.delete(
    '/:id',
    logged,
    checkRole,
    controller.delete.bind(controller)
);
