import { OrderTypes } from "./Order";
import OrderBook from "./OrderBooksStore";
const orderbook = new OrderBook(OrderTypes.SELL);
// orderbook.addNewOrder({
//  orderType: OrderTypes.SELL,
//  amount: 3,
//  price: 70,
//  id: 'ddd',
//  symbol: 'hhh',
// });
// orderbook.addNewOrder({
//  orderType: OrderTypes.SELL,
//  amount: 1,
//  price: 50,
//  id: 'ddd',
//  symbol: 'hhh',
// });
// orderbook.addNewOrder({
//  orderType: OrderTypes.SELL,
//  amount: 1,
//  price: 150,
//  id: 'ddd',
//  symbol: 'hhh',
// });
// orderbook.addNewOrder({
//   orderType: OrderTypes.SELL,
//   amount: 3,
//   price: 100,
//   id: 'ddd',
//   symbol: 'hhh',
// });

orderbook.addNewOrder({
  orderType: OrderTypes.BUY,
  amount: 2,
  price: 90,
  id: 'ddd',
  symbol: 'hhh',
});
orderbook.addNewOrder({
  orderType: OrderTypes.BUY,
  amount: 5,
  price: 100,
  id: 'ddd',
  symbol: 'hhh',
});
console.log(JSON.stringify(orderbook.getBook()));
console.log();
console.log('SELL', {amount: 6,
price: 100,});

orderbook.consumeOrder({
 orderType: OrderTypes.SELL,
  amount: 6,
  price: 100,
  id: 'ddd',
  symbol: 'hhh',
});
console.log();
console.log(JSON.stringify(orderbook.getBook()));
