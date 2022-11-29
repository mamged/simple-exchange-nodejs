import { Order, OrderTypes } from './Order';
import OrderBook, { OrderBookOptions } from './OrderBook';
import { OrderBookLevelState } from './OrderBookLevel';

type Book = Map<number, Order[]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
export default class OrderBooksStore {
  book: Book;
  sortedPriceSlots: number[];

  constructor() {
    this.book = new Map();
  }

  /**
   * @param {string} symbol
   * @returns {OrderBook} created for symbol if not already tracked
   */
  getBook(): [number, Order[]][] {
    return Array.from(this.book);
  }
  addNewOrder(order: Order) {
    if (this.isPriceExisting(order.price)) {
      this.addOrderToExistingPriceSlot(order)
    }
    else this.addNewOrderSlot(order);
  }
  addNewOrderSlot(order: Order) {
    this.book.set(order.price, [order]);
    this.updatePriceSlotsOrder();
  }
  addOrderToExistingPriceSlot(order: Order) {
    const priceSlot = this.book.get(order.price);
    if (priceSlot) {
      priceSlot.push(order);
      this.book.set(order.price, priceSlot);
    }
  }
  isPriceExisting(price: number): boolean {
    return this.book.has(price);
  }
  consumePriceSlot(order, priceSlot) {
    const remainingPriceSlot = priceSlot?.reduce((all: Order[], current: Order) => {
      //order fullfilled
      if (order.amount <= 0) all.push(current);
      else {
        if (order.amount > current.amount) {
          order.amount = order.amount - current.amount;
        } else {
          current.amount = current.amount - order.amount;
          order.amount = 0;
          all.push(current);
        }
      }
      return all;
    }, []);
    if (remainingPriceSlot.length > 0){
      // console.log('updatubg', order.price, remainingPriceSlot);
      this.book.set(priceSlot[0].price, remainingPriceSlot);
      // console.log(this.book);;
      
    }
    else{
      // console.log('deleting', order.price);
      this.book.delete(priceSlot[0].price);
      // console.log(this.book);

    }
    return order;
  }
  iterateOverBookOrders(order: Order, orderBookEntries) {

    const orderSlotItr = orderBookEntries.next();
    const orderSlot = orderSlotItr.value;
    if (orderSlotItr.done || order.amount <= 0) {
      return;
    } else {
      const [slotPrice, slot] = orderSlot[1];
      if ((order.orderType === OrderTypes.BUY && slotPrice <= order.price) || order.orderType === OrderTypes.SELL && slotPrice >= order.price) {
        const orderRemaining = this.consumePriceSlot(order, slot);
        console.log('orderRemaining', orderRemaining);
        
        if (orderRemaining.amount > 0) {
          this.iterateOverBookOrders(orderRemaining, orderBookEntries);
        }
      } else this.iterateOverBookOrders(order, orderBookEntries);
    }
  }
  consumeOrder(order: Order) {
    const orderBookEntries = this.getBook().entries();
    this.iterateOverBookOrders(order, orderBookEntries);
    return;
    if (this.isPriceExisting(order.price)) {
      const priceSlot = this.book.get(order.price);
      const newSlot = this.consumePriceSlot(order, priceSlot)
      console.log('!!newSlot', newSlot);
    } else {
      const orderBookEntries = this.getBook().entries();
      this.iterateOverBookOrders(order, orderBookEntries);
    }
  }
  updatePriceSlotsOrder(): void {
    this.sortedPriceSlots = Array.from(this.book.keys()).sort();
  }
}
