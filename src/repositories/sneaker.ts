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

    search = async (query: string): Promise<Array<Sneaker>> => {
        debug('search', query);
        const result = await this.#Model.find({
            $or: [
                { brand: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } },
                { gender: { $regex: query, $options: 'i' } },
            ],
        });

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
