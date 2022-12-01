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

export interface OrderRepo<T> {
    find: (data: Partial<T>) => Promise<T>;
    post: (data: Partial<T>) => Promise<T>;
    delete: (userId: string, itemId: string) => Promise<T>;
}
