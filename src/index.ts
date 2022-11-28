import createDebug from 'debug';
import { PORT } from './config.js';
import http from 'http';
import { app } from './app.js';
import { DbConnections } from './utils/db/db.connections.js';
const debug = createDebug('SERVER');

const connections = DbConnections.getInstance();

const port = PORT || 3456;
const server = http.createServer(app);

server.on('listening', () => {
    const address = server.address();
    if (address === null) {
        throw new Error('Address is null');
    }
    let bind: string;

    if (typeof address === 'string') {
        bind = 'pipe ' + address;
    } else {
        bind =
            address.address === '::'
                ? `http://localhost:${address?.port}`
                : `port ${address?.port}`;
    }
    debug(`Listening on ${bind}`);
});

connections.dbConnect().then((mongoose) => {
    debug(`Connected to ${mongoose.connection.name}`);
    server.listen(port);
});
