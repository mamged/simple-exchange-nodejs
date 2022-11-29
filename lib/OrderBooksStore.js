"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("./Order");
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
class OrderBooksStore {
    constructor() {
        this.book = new Map();
    }
    /**
     * @param {string} symbol
     * @returns {OrderBook} created for symbol if not already tracked
     */
    getBook() {
        return Array.from(this.book);
    }
    addNewOrder(order) {
        if (this.isPriceExisting(order.price)) {
            this.addOrderToExistingPriceSlot(order);
        }
        else
            this.addNewOrderSlot(order);
    }
    addNewOrderSlot(order) {
        this.book.set(order.price, [order]);
        this.updatePriceSlotsOrder();
    }
    addOrderToExistingPriceSlot(order) {
        const priceSlot = this.book.get(order.price);
        if (priceSlot) {
            priceSlot.push(order);
            this.book.set(order.price, priceSlot);
        }
    }
    isPriceExisting(price) {
        return this.book.has(price);
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
        if (remainingPriceSlot.length > 0) {
            // console.log('updatubg', order.price, remainingPriceSlot);
            this.book.set(priceSlot[0].price, remainingPriceSlot);
            // console.log(this.book);;
        }
        else {
            // console.log('deleting', order.price);
            this.book.delete(priceSlot[0].price);
            // console.log(this.book);
        }
        return order;
    }
    iterateOverBookOrders(order, orderBookEntries) {
        const orderSlotItr = orderBookEntries.next();
        const orderSlot = orderSlotItr.value;
        if (orderSlotItr.done || order.amount <= 0) {
            return;
        }
        else {
            const [slotPrice, slot] = orderSlot[1];
            if ((order.orderType === Order_1.OrderTypes.BUY && slotPrice <= order.price) || order.orderType === Order_1.OrderTypes.SELL && slotPrice >= order.price) {
                const orderRemaining = this.consumePriceSlot(order, slot);
                console.log('orderRemaining', orderRemaining);
                if (orderRemaining.amount > 0) {
                    this.iterateOverBookOrders(orderRemaining, orderBookEntries);
                }
            }
            else
                this.iterateOverBookOrders(order, orderBookEntries);
        }
    }
    consumeOrder(order) {
        const orderBookEntries = this.getBook().entries();
        this.iterateOverBookOrders(order, orderBookEntries);
        return;
        if (this.isPriceExisting(order.price)) {
            const priceSlot = this.book.get(order.price);
            const newSlot = this.consumePriceSlot(order, priceSlot);
            console.log('!!newSlot', newSlot);
        }
        else {
            const orderBookEntries = this.getBook().entries();
            this.iterateOverBookOrders(order, orderBookEntries);
        }
    }
    updatePriceSlotsOrder() {
        this.sortedPriceSlots = Array.from(this.book.keys()).sort();
    }
}
exports.default = OrderBooksStore;
//# sourceMappingURL=OrderBooksStore.js.map