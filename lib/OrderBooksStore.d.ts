import { Order, OrderTypes } from './Order';
declare type Book = Map<number, Order[]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
export default class OrderBooksStore {
    book: Book;
    sellbook: Book;
    buybook: Book;
    orderbookType: OrderTypes;
    constructor(orderbookType: OrderTypes);
    /**
     * @param {string} symbol
     * @returns {OrderBook} created for symbol if not already tracked
     */
    getBook(): {
        buyOrderBook: [number, Order[]][];
        sellOrderBook: [number, Order[]][];
    };
    addNewOrder(order: Order): void;
    addNewOrderSlot(order: Order): void;
    ordeerbookDB(orderType: OrderTypes): Book;
    addOrderToExistingPriceSlot(order: Order): void;
    isPriceSlotExisting(order: Order): boolean;
    consumePriceSlot(order: Order, priceSlot: Order[]): Order;
    iterateOverBookOrders(order: Order, orderBookEntries: any): Order;
    consumeOrder(order: Order): void;
}
export {};
