import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { errorManager } from './middlewares/errors.js';
import { ordersRouter } from './routers/orders.js';
import { sneakersRouter } from './routers/sneakers.js';
import { usersRouter } from './routers/users.js';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.get('/', (_req, resp) => {
    app.use(express.static('public'));
    resp.sendFile('index.html', { root: './public' });
});

app.use('/sneakers', sneakersRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.use(errorManager);
