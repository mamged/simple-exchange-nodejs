import { OrderBookOptions } from './OrderBook';
declare type Book = Map<number, [Order]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
export declare class OrderBooksStore {
    book: Book;
    constructor(options?: OrderBookOptions);
    /**
     * @param {string} symbol
     * @returns {OrderBook} created for symbol if not already tracked
     */
    getBook(): [number, [Order]][];
    addNewOrder(order: Order): void;
    addNewOrderSlot(order: Order): void;
    addOrderToExistingPriceSlot(order: Order): void;
    isPriceExisting(price: number): boolean;
    consumeOrder(order: Order): void;
}
export {};
