import createDebug from 'debug';
import { User, UserModel } from '../entities/user.js';
import { encryptPassword } from '../services/auth.js';
import { BasicRepo, id } from './repo.js';
const debug = createDebug('SERVER:src:repositories:userRepository');

export class UserRepository implements BasicRepo<User> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = UserModel;
    private constructor() {
        debug('instance');
    }

    async get(id: id): Promise<User> {
        debug('get', id);
        const result = await this.#Model.findById(id); //as User;
        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }

    async post(data: Partial<User>): Promise<User> {
        debug('post', data);
        if (typeof data.password !== 'string') {
            throw new Error('');
        }
        data.password = await encryptPassword(data.password);
        const result = await this.#Model.create(data);
        return result;
    }

    async search(query: string): Promise<User[]> {
        debug('search', query);

        const result = await this.#Model.find({
            $or: [{ name: query }, { email: query }, { surname: query }],
        });

        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }
}
