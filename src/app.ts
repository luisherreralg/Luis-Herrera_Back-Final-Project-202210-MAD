import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

const template = 'Work in progress';
app.get('/', (_req, res) => {
    res.send(template).end();
});
