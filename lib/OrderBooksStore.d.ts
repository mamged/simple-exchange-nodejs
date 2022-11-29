import { Order, OrderTypes } from './Order';
declare type Book = Map<number, Order[]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBook
 */
export default class OrderBook {
    sellbook: Book;
    buybook: Book;
    orderbookType: OrderTypes;
    constructor(orderbookType: OrderTypes);
    /**
     * @returns {buyOrderBook, sellOrderBook} return latest snapshot of the orderbook
     */
    getBook(): {
        buyOrderBook: [number, Order[]][];
        sellOrderBook: [number, Order[]][];
    };
    /**
     * add new price slot if doesn't exist
     * @param {Order} order
     * @returns {void}
     */
    addNewOrder(order: Order): void;
    /**
     * retrieve seconderu
     * @param {Order} order
     * @returns {void}
     */
    secondaryOrderbookDB(orderType: OrderTypes): Book;
    ordeerbookDB(orderType: OrderTypes): Book;
    addOrderToExistingPriceSlot(order: Order): void;
    isPriceSlotExisting(order: Order): boolean;
    consumePriceSlot(order: Order, priceSlot: Order[]): Order;
    iterateOverBookOrders(order: Order, orderBookEntries: any): Order;
    consumeOrder(order: Order): void;
}
export {};
