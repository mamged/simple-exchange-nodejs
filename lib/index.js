"use strict";
// class OrderBook {
//  symbol: string;
//  constructor(symbol: string) {
//   this.symbol = symbol;
//  }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//  buy(){
//  }
//  sell(){
//  }
// }
const Order_1 = require("./Order");
const OrderBooksStore_1 = __importDefault(require("./OrderBooksStore"));
const orderbook = new OrderBooksStore_1.default();
orderbook.addNewOrder({
    orderType: Order_1.OrderTypes.BUY,
    amount: 3,
    price: 70,
    id: 'ddd',
    symbol: 'hhh',
});
orderbook.addNewOrder({
    orderType: Order_1.OrderTypes.BUY,
    amount: 1,
    price: 50,
    id: 'ddd',
    symbol: 'hhh',
});
orderbook.addNewOrder({
    orderType: Order_1.OrderTypes.BUY,
    amount: 1,
    price: 150,
    id: 'ddd',
    symbol: 'hhh',
});
orderbook.addNewOrder({
    orderType: Order_1.OrderTypes.BUY,
    amount: 3,
    price: 100,
    id: 'ddd',
    symbol: 'hhh',
});
orderbook.addNewOrder({
    orderType: Order_1.OrderTypes.SELL,
    amount: 2,
    price: 90,
    id: 'ddd',
    symbol: 'hhh',
});
orderbook.addNewOrder({
    orderType: Order_1.OrderTypes.SELL,
    amount: 5,
    price: 100,
    id: 'ddd',
    symbol: 'hhh',
});
console.log(JSON.stringify(orderbook.getBook()));
orderbook.consumeOrder({
    orderType: Order_1.OrderTypes.BUY,
    amount: 6,
    price: 100,
    id: 'ddd',
    symbol: 'hhh',
});
console.log(JSON.stringify(orderbook.getBook()));
//# sourceMappingURL=index.js.map