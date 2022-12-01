import { id, Repo } from './repo.js';
import createDebug from 'debug';
import { ProtoSneaker, Sneaker, SneakerModel } from '../entities/sneaker.js';
const debug = createDebug('SERVER:src:repositories:sneakerRepository');

export class SneakerRepository implements Repo<Sneaker> {
    static instance: SneakerRepository;

    static getInstance(): SneakerRepository {
        if (!SneakerRepository.instance) {
            SneakerRepository.instance = new SneakerRepository();
        }
        return SneakerRepository.instance;
    }

    #Model = SneakerModel;

    private constructor() {
        debug('SneakerRepository instance created');
    }

    async getAll(): Promise<Array<Sneaker>> {
        debug('getAll');
        const result = await this.#Model.find();
        if (result.length === 0) {
            throw new Error('Empty collection');
        }
        return result;
    }

    // ! NEED TO CHECK
    // * Found the $or operator on
    // https://stackoverflow.com/questions/33627238/mongoose-find-with-multiple-conditions
    //
    // TODO: read more about regex
    // https://www.mongodb.com/docs/manual/reference/operator/query/regex/

    search = async (query: string): Promise<Array<Sneaker>> => {
        debug('search', query);
        const result = await this.#Model.find({
            $or: [{ brand: query }, { model: query }, { gender: query }],
        });

        if (result.length === 0) {
            throw new Error('No matched results');
        }
        return result;
    };

    async get(id: id): Promise<Sneaker> {
        debug('get', id);
        const result = await this.#Model.findById(id);
        if (!result) {
            throw new Error('Not found');
        }
        return result;
    }

    async post(data: ProtoSneaker): Promise<Sneaker> {
        debug('post', data);

        if (Object.keys(data).length === 0) {
            throw new Error('No data provided');
        }

        const result = await this.#Model.create(data);
        return result;
    }

    async patch(id: id, data: Partial<Sneaker>): Promise<Sneaker> {
        debug('patch', id);

        if (Object.keys(data).length === 0) {
            throw new Error('No data provided');
        }

        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) {
            throw new Error('Not found');
        }
        return result;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);
        await this.#Model.findByIdAndDelete(id);
        return id;
    }
}
