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
     * retrieve seconderu
     * @param {Order} order
     * @returns {void}
     */
    secondaryOrderbookDB(orderType) {
        if (orderType === Order_1.OrderTypes.BUY)
            return this.sellbook;
        return this.buybook;
    }
    ordeerbookDB(orderType) {
        if (orderType === Order_1.OrderTypes.BUY)
            return this.buybook;
        return this.sellbook;
    }
    addOrderToExistingPriceSlot(order) {
        const orderBook = this.ordeerbookDB(order.orderType);
        const priceSlot = orderBook.get(order.price);
        if (priceSlot) {
            priceSlot.push(order);
            orderBook.set(order.price, priceSlot);
        }
    }
    isPriceSlotExisting(order) {
        return this.ordeerbookDB(order.orderType).has(order.price);
    }
    consumePriceSlot(order, priceSlot) {
        const remainingPriceSlot = priceSlot === null || priceSlot === void 0 ? void 0 : priceSlot.reduce((all, current) => {
            //order fullfilled
            if (order.amount <= 0)
                all.push(current);
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
        // console.log('!!!!!!', remainingPriceSlot);
        const orderbook = this.secondaryOrderbookDB(order.orderType);
        if (remainingPriceSlot.length > 0) {
            orderbook.set(priceSlot[0].price, remainingPriceSlot);
        }
        else {
            // console.log('deleting', priceSlot[0].price, this.buybook);
            orderbook.delete(priceSlot[0].price);
            // console.log('deleting', priceSlot[0].price, this.buybook);
        }
        console.log('order:', order);
        return order;
    }
    iterateOverBookOrders(order, orderBookEntries) {
        const orderSlotItr = orderBookEntries.next();
        const orderSlot = orderSlotItr.value;
        if (orderSlotItr.done || order.amount <= 0) {
            // console.log('done!!', order);
            return order;
        }
        else {
            const [slotPrice, slot] = orderSlot;
            if ((order.orderType === Order_1.OrderTypes.BUY && slotPrice <= order.price) || order.orderType === Order_1.OrderTypes.SELL && slotPrice >= order.price) {
                // console.log('consuming!!',orderSlot);
                const orderRemaining = this.consumePriceSlot(order, slot);
                if (orderRemaining.amount > 0) {
                    this.iterateOverBookOrders(orderRemaining, orderBookEntries);
                }
            }
            else {
                // console.log('!!order', order);
                // console.log('!!slotPrice', slotPrice);
                this.iterateOverBookOrders(order, orderBookEntries);
            }
        }
        return order;
    }
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
//# sourceMappingURL=OrderBooksStore.js.map