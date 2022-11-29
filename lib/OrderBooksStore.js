"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBooksStore = void 0;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
class OrderBooksStore {
    constructor(options) {
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
            this.addNewOrder(order);
    }
    addNewOrderSlot(order) {
        this.book.set(order.price, [order]);
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
    consumeOrder(order) {
        if (this.isPriceExisting(order.price)) {
        }
    }
}
exports.OrderBooksStore = OrderBooksStore;
//# sourceMappingURL=OrderBooksStore.js.map