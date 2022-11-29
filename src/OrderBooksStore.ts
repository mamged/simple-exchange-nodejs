import { Order, OrderTypes } from './Order';

type Book = Map<number, Order[]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBook
 */
export default class OrderBook {
  sellbook: Book;
  buybook: Book;
  orderbookType: OrderTypes;
  constructor(orderbookType: OrderTypes) {
    this.orderbookType = orderbookType;
    this.buybook = new Map();
    this.sellbook = new Map();
  }

  /**
   * @returns {buyOrderBook, sellOrderBook} return latest snapshot of the orderbook
   */
  getBook(): { buyOrderBook: [number, Order[]][], sellOrderBook: [number, Order[]][] } {
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
  addNewOrder(order: Order) {
    if (this.isPriceSlotExisting(order)) {
      this.addOrderToExistingPriceSlot(order)
    }
    else this.ordeerbookDB(order.orderType).set(order.price, [order]);
  }

  /**
   * retrieve seconderu 
   * @param {Order} order
   * @returns {void}
   */
  secondaryOrderbookDB(orderType: OrderTypes): Book {
    if (orderType === OrderTypes.BUY)
      return this.sellbook;
    return this.buybook;
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
  iterateOverBookOrders(order: Order, orderBookEntries) {

    const orderSlotItr = orderBookEntries.next();
    const orderSlot = orderSlotItr.value;
    if (orderSlotItr.done || order.amount <= 0) {
      // console.log('done!!', order);

      return order;
    } else {
      const [slotPrice, slot] = orderSlot;
      if ((order.orderType === OrderTypes.BUY && slotPrice <= order.price) || order.orderType === OrderTypes.SELL && slotPrice >= order.price) {
        // console.log('consuming!!',orderSlot);

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
    console.log('orderLeftOver:', orderLeftOver);
    if (orderLeftOver.amount > 0)
      this.addNewOrder(order);
  }
}
