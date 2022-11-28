import createDebug from 'debug';
import mongoose from 'mongoose';
import { CLUSTER, PW, USER } from '../../config.js';

const debug = createDebug('SERVER:src:utils:db:db.connections');

export class DbConnections {
    static instance: DbConnections;

    public static getInstance(): DbConnections {
        if (!DbConnections.instance) {
            DbConnections.instance = new DbConnections();
        }
        return DbConnections.instance;
    }

    private constructor() {
        debug('DbConnections instance created');
    }

    async dbConnect() {
        const DBName =
            process.env.NODE_ENV !== 'test' ? 'Sneakers' : 'SneakersTesting';
        let uri = `mongodb+srv://${USER}:${PW}`;
        uri += `@${CLUSTER}/${DBName}?retryWrites=true&w=majority`;
        return mongoose.connect(uri);
    }

    async dbDisconnect() {
        await mongoose.disconnect();
        return mongoose.connection.readyState;
    }
}
