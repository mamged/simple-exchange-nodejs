import { Order, OrderTypes } from './Order';
declare type Book = Map<number, Order[]>;
/**
 * an orderbook store to handle buy and sell orders.
 * @class OrderBook.
 */
export default class OrderBook {
    sellbook: Book;
    buybook: Book;
    orderbookType: OrderTypes;
    constructor(orderbookType: OrderTypes);
    /**
     * @returns {buyOrderBook, sellOrderBook} return latest snapshot of the orderbook.
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
     * retrieve secondery order reference.
     * @param {OrderTypes} orderType order type.
     * @returns {Book} returns the buy orderbook if orderType is SELL, and the sell orderbook if order type is BUY.
     */
    secondaryOrderbookDB(orderType: OrderTypes): Book;
    /**
     * retrieve the orderbook of the same order type.
     * @param {OrderTypes} orderType order type.
     * @returns {Book} returns the buy orderbook if orderType is BUY, and the sell orderbook if order type is SELL.
     */
    ordeerbookDB(orderType: OrderTypes): Book;
    /**
     * add new order to price slot.
     * @param {Order} order the new order.
     * @returns {void}
     */
    addOrderToExistingPriceSlot(order: Order): void;
    /**
     * check if price slot existing in the orderbook.
     * @param {Order} order the new order.
     * @returns {boolean} return wither price slot existing or not.
     */
    isPriceSlotExisting(order: Order): boolean;
    /**
     * handle order subtraction from an existing price slot accumulatively.
     * @param {Order} order the new order.
     * @param {Order[]} priceSlot the targeted price slot.
     * @returns {Order} return the order with the remaining amount after processing.
     */
    consumePriceSlot(order: Order, priceSlot: Order[]): Order;
    /**
     * handle order subtraction from an existing price slot accumulatively.
     * @param {Order} order the new order.
     * @param {IterableIterator} orderBookEntries the orderbook map enteries.
     * @returns {Order} return the order with the remaining amount after processing.
     */
    iterateOverBookOrders(order: Order, orderBookEntries: any): Order;
    /**
     * handle new orders.
     * @param {Order} order the new order.
     * @returns {void}
     */
    consumeOrder(order: Order): void;
}
export {};
