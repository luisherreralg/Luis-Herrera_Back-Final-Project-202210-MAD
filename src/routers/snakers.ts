import { Router } from 'express';

export const sneakersRouter = Router();
const controller = new SneakersController(SneakerReporitory.getInstance());

sneakersRouter.get('/', controller.getAll.bind(controller));
sneakersRouter.get('/:id', controller.get.bind(controller));
sneakersRouter.post('/', controller.post.bind(controller));
sneakersRouter.patch('/:id', controller.patch.bind(controller));
sneakersRouter.delete('/:id', controller.delete.bind(controller));
