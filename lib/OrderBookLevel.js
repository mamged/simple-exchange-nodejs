"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookLevel = void 0;
/**
 * One level in orderbook
 * @param {string} symbol
 * @param {number} price
 * @param {string} [side='Buy'|'Sell']
 * @param {number} qty asset at this level
 */
function OrderBookLevel(symbol, price, side, qty, ...extraState) {
    const level = [symbol, price, side, qty, undefined];
    if (extraState.length) {
        level.push(extraState);
    }
    return level;
}
exports.OrderBookLevel = OrderBookLevel;
//# sourceMappingURL=OrderBookLevel.js.map