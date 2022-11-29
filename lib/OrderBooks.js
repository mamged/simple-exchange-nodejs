"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("./Order");
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBook
 */
class OrderBook {
    constructor(orderbookType) {
        this.orderbookType = orderbookType;
        this.buybook = new Map();
        this.sellbook = new Map();
    }
    /**
     * @returns {buyOrderBook, sellOrderBook} return latest snapshot of the orderbook
     */
    getBook() {
        return {
            buyOrderBook: Array.from(this.buybook),
            sellOrderBook: Array.from(this.sellbook),
        };
    }
    /**
     * add new price slot if doesn't exist
     * @param {Order} order
     * @returns {void}
     */
    addNewOrder(order) {
        if (this.isPriceSlotExisting(order)) {
            this.addOrderToExistingPriceSlot(order);
        }
        else
            this.ordeerbookDB(order.orderType).set(order.price, [order]);
    }
    /**
     * retrieve secondery order reference.
     * @param {OrderTypes} orderType order type.
     * @returns {Book} returns the buy orderbook if orderType is SELL, and the sell orderbook if order type is BUY.
     */
    secondaryOrderbookDB(orderType) {
        if (orderType === Order_1.OrderTypes.BUY)
            return this.sellbook;
        return this.buybook;
    }
    /**
     * retrieve the orderbook of the same order type.
     * @param {OrderTypes} orderType order type.
     * @returns {Book} returns the buy orderbook if orderType is BUY, and the sell orderbook if order type is SELL.
     */
    ordeerbookDB(orderType) {
        if (orderType === Order_1.OrderTypes.BUY)
            return this.buybook;
        return this.sellbook;
    }
    /**
     * add new order to price slot.
     * @param {Order} order the new order.
     * @returns {void}
     */
    addOrderToExistingPriceSlot(order) {
        const orderBook = this.ordeerbookDB(order.orderType);
        const priceSlot = orderBook.get(order.price);
        if (priceSlot) {
            priceSlot.push(order);
            orderBook.set(order.price, priceSlot);
        }
    }
    /**
     * check if price slot existing in the orderbook.
     * @param {Order} order the new order.
     * @returns {boolean} return wither price slot existing or not.
     */
    isPriceSlotExisting(order) {
        return this.ordeerbookDB(order.orderType).has(order.price);
    }
    /**
     * handle order subtraction from an existing price slot accumulatively.
     * @param {Order} order the new order.
     * @param {Order[]} priceSlot the targeted price slot.
     * @returns {Order} return the order with the remaining amount after processing.
     */
    consumePriceSlot(order, priceSlot) {
        const remainingPriceSlot = priceSlot === null || priceSlot === void 0 ? void 0 : priceSlot.reduce((all, current) => {
            if (order.amount <= 0)
                all.push(current); //order fullfilled
            else {
                if (order.amount > current.amount) {
                    order.amount = order.amount - current.amount;
                }
                else {
                    current.amount = current.amount - order.amount;
                    order.amount = 0;
                    all.push(current);
                }
            }
            return all;
        }, []);
        const orderbook = this.secondaryOrderbookDB(order.orderType);
        if (remainingPriceSlot.length > 0) {
            orderbook.set(priceSlot[0].price, remainingPriceSlot);
        }
        else {
            orderbook.delete(priceSlot[0].price);
        }
        return order;
    }
    /**
     * handle order subtraction from an existing price slot accumulatively.
     * @param {Order} order the new order.
     * @param {IterableIterator} orderBookEntries the orderbook map enteries.
     * @returns {Order} return the order with the remaining amount after processing.
     */
    iterateOverBookOrders(order, orderBookEntries) {
        const orderSlotItr = orderBookEntries.next();
        const orderSlot = orderSlotItr.value;
        if (orderSlotItr.done || order.amount <= 0) {
            return order;
        }
        else {
            const [slotPrice, slot] = orderSlot;
            if ((order.orderType === Order_1.OrderTypes.BUY && slotPrice <= order.price) || order.orderType === Order_1.OrderTypes.SELL && slotPrice >= order.price) {
                const orderRemaining = this.consumePriceSlot(order, slot);
                if (orderRemaining.amount > 0) {
                    this.iterateOverBookOrders(orderRemaining, orderBookEntries);
                }
            }
            else {
                this.iterateOverBookOrders(order, orderBookEntries);
            }
        }
        return order;
    }
    /**
     * handle new orders.
     * @param {Order} order the new order.
     * @returns {void}
     */
    consumeOrder(order) {
        const consumableOrderType = order.orderType === Order_1.OrderTypes.BUY ? Order_1.OrderTypes.SELL : Order_1.OrderTypes.BUY;
        const orderBookEntries = this.ordeerbookDB(consumableOrderType).entries();
        const orderLeftOver = this.iterateOverBookOrders(order, orderBookEntries);
        console.log('orderLeftOver:', orderLeftOver);
        if (orderLeftOver.amount > 0)
            this.addNewOrder(order);
    }
}
exports.default = OrderBook;
//# sourceMappingURL=OrderBooks.js.map