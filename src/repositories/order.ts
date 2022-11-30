import createDebug from 'debug';
import mongoose, { Types } from 'mongoose';
import { Order, OrderModel, ProtoOrder } from '../entities/order.js';
import { User } from '../entities/user.js';

const debug = createDebug('SERVER:src:repositories:OrderRepository');

// ! Falta tipar el repo
export class OrderRepository {
    static instance: OrderRepository;

    public static getInstance(): OrderRepository {
        if (!OrderRepository.instance) {
            OrderRepository.instance = new OrderRepository();
        }
        return OrderRepository.instance;
    }

    #Model = OrderModel;
    private constructor() {
        debug('instanced');
    }

    async find(userId: Partial<Order>): Promise<Array<Order>> {
        debug('find', { userId });
        const result = await this.#Model
            .find(userId)
            .populate<{ _id: Types.ObjectId }>('cartedBy')
            .populate<{ _id: Types.ObjectId }>('cartedItem');

        if (!result) {
            throw new Error('There is no order with that id');
        }
        return result;
    }

    async post(data: ProtoOrder): Promise<Order> {
        debug('post', { data });
        const result = await this.#Model.create(data);

        return result;
    }

    async delete(
        userId: Partial<User>,
        itemId: Partial<Order>
    ): Promise<Order> {
        debug('delete', { userId, itemId });

        // We find the orders owned by the user
        const userOrders = await this.#Model.find({
            cartedBy: userId,
        });
        if (userOrders[0] === undefined) {
            throw new Error('There is no orders associated to this user');
        }
        debug('userOrders', userOrders);

        // When we have the user orders, now we do a filter to get the order for the product
        const orderToDelete = userOrders.filter((order) => {
            return order.cartedItem.toString() === itemId.toString();
        });
        if (orderToDelete[0] === undefined) {
            throw new Error(
                'There is no orders for this user associated to this product'
            );
        }
        debug('orderToDelete', orderToDelete);

        // Once we have the product that we want to delete, we just delete it
        await this.#Model.findOneAndDelete({
            cartedItem: orderToDelete[0].cartedItem.toString(),
        });

        return orderToDelete[0];
    }
}
