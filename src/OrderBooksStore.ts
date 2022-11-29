import { Order, OrderTypes } from './Order';

type Book = Map<number, Order[]>;
const buyOrderbook: Book = new Map<number, Order[]>();
const sellOrderbook: Book = new Map<number, Order[]>();
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
export default class OrderBooksStore {
  book: Book;
  sellbook: Book;
  buybook: Book;
  orderbookType: OrderTypes;
  constructor(orderbookType: OrderTypes) {
    this.orderbookType = orderbookType;
    // if(orderbookType == OrderTypes.BUY)
    this.book = new Map<number, Order[]>();
    this.buybook = new Map<number, Order[]>();
    this.sellbook = new Map<number, Order[]>();
    // else
    //   this.book = sellOrderbook;
  }

  /**
   * @param {string} symbol
   * @returns {OrderBook} created for symbol if not already tracked
   */
  getBook(): { buyOrderBook: [number, Order[]][], sellOrderBook: [number, Order[]][] } {
    return {
      buyOrderBook: Array.from(this.buybook),
      sellOrderBook: Array.from(this.sellbook),
    };
  }
  addNewOrder(order: Order) {
    if (this.isPriceSlotExisting(order)) {
      this.addOrderToExistingPriceSlot(order)
    }
    else this.addNewOrderSlot(order);
  }
  addNewOrderSlot(order: Order) {
    this.ordeerbookDB(order.orderType).set(order.price, [order]);
  }
  ordeerbookDB(orderType: OrderTypes): Book {
    if (orderType === OrderTypes.BUY)
      return this.buybook;
    return this.sellbook;
  }
  addOrderToExistingPriceSlot(order: Order) {
    const orderBook = this.ordeerbookDB(order.orderType);
    const priceSlot = orderBook.get(order.price);
    if (priceSlot) {
      priceSlot.push(order);
      orderBook.set(order.price, priceSlot);
    }
  }
  isPriceSlotExisting(order: Order): boolean {
    return this.ordeerbookDB(order.orderType).has(order.price);
  }
  consumePriceSlot(order: Order, priceSlot: Order[]) {
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
    const orderbook = this.ordeerbookDB(order.orderType);
    if (remainingPriceSlot.length > 0) {
      orderbook.set(priceSlot[0].price, remainingPriceSlot);

    }
    else {
      orderbook.delete(priceSlot[0].price);

    }
    return order;
  }
  iterateOverBookOrders(order: Order, orderBookEntries) {

    const orderSlotItr = orderBookEntries.next();
    const orderSlot = orderSlotItr.value;
    if (orderSlotItr.done || order.amount <= 0) {
      // console.log('done!!', order);

      return order;
    } else {
      const [slotPrice, slot] = orderSlot;
      // console.log('consuming!!',orderSlot);
      if ((order.orderType === OrderTypes.BUY && slotPrice <= order.price) || order.orderType === OrderTypes.SELL && slotPrice >= order.price) {
        
        const orderRemaining = this.consumePriceSlot(order, slot);
        if (orderRemaining.amount > 0) {

          this.iterateOverBookOrders(orderRemaining, orderBookEntries);
        }
      } else {
        // console.log('!!order', order);
        // console.log('!!slotPrice', slotPrice);

        this.iterateOverBookOrders(order, orderBookEntries);
      }
    }
    return order;
  }
  consumeOrder(order: Order) {
    const consumableOrderType = order.orderType === OrderTypes.BUY ? OrderTypes.SELL : OrderTypes.BUY;
    const orderBookEntries = this.ordeerbookDB(consumableOrderType).entries();
    const orderLeftOver = this.iterateOverBookOrders(order, orderBookEntries);
    // console.log('orderLeftOver:', orderLeftOver);
    // return orderLeftOver;
  }
}
