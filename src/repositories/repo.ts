import { Types } from 'mongoose';
import { Order, ProtoOrder } from '../entities/order';

export type id = number | string;

export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    post: (data: Partial<T>) => Promise<T>;
    search: (query: string) => Promise<Array<T>>;
}

export interface ExtraRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface Repo<T> extends BasicRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface UserRepo<T> {
    find: (data: Partial<T>) => Promise<T>;
    post: (data: Partial<T>) => Promise<T>;
    search: (query: string) => Promise<Array<T>>;
}

export type findData = {
    cartedBy: Types.ObjectId;
};
export interface OrderRepo<T> {
    find: (data: findData) => Promise<Array<Order>>;
    post: (data: ProtoOrder) => Promise<Order>;
    delete: (userId: string, itemId: string) => Promise<T>;
    patch: (userId: string, itemId: string, data: Partial<T>) => Promise<T>;
}
