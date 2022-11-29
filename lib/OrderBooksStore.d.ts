import { Order } from './Order';
declare type Book = Map<number, Order[]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
export default class OrderBooksStore {
    book: Book;
    sortedPriceSlots: number[];
    constructor();
    /**
     * @param {string} symbol
     * @returns {OrderBook} created for symbol if not already tracked
     */
    getBook(): [number, Order[]][];
    addNewOrder(order: Order): void;
    addNewOrderSlot(order: Order): void;
    addOrderToExistingPriceSlot(order: Order): void;
    isPriceExisting(price: number): boolean;
    consumePriceSlot(order: any, priceSlot: any): any;
    iterateOverBookOrders(order: Order, orderBookEntries: any): void;
    consumeOrder(order: Order): void;
    updatePriceSlotsOrder(): void;
}
export {};
