import createDebug from 'debug';
import { ProtoUser, User, UserModel } from '../entities/user.js';
import { encryptPassword } from '../services/auth.js';
import { id, UserRepo } from './repo.js';
const debug = createDebug('SERVER:src:repositories:userRepository');

export class UserRepository implements Partial<UserRepo<User>> {
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

    async post(data: Partial<ProtoUser>): Promise<User> {
        debug('post', data);

        data.password = await encryptPassword(data.password as string);
        const result = await this.#Model.create(data);
        return result;
    }

    async search(query: string): Promise<User[]> {
        debug('search', query);

        const result = await this.#Model.find({
            $or: [{ name: query }, { email: query }, { surname: query }],
        });

        return result;
    }

    async find(search: Partial<User>): Promise<User> {
        debug('find', { search });
        const result = (await this.#Model.findOne(search)) as User;
        return result;
    }
}
