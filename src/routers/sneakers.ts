import { Router } from 'express';
import { SneakerController } from '../controllers/sneaker.controller.js';
import { SneakerRepository } from '../repositories/sneaker.js';

export const sneakersRouter = Router();
const controller = new SneakerController(SneakerRepository.getInstance());

sneakersRouter.get('/', controller.getAll.bind(controller));
sneakersRouter.get('/:id', controller.get.bind(controller));
sneakersRouter.get('/search/:query', controller.search.bind(controller));
sneakersRouter.post('/', controller.post.bind(controller));
sneakersRouter.patch('/:id', controller.patch.bind(controller));
sneakersRouter.delete('/:id', controller.delete.bind(controller));
