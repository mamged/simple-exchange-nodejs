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
   * retrieve secondery order reference.
   * @param {OrderTypes} orderType order type.
   * @returns {Book} returns the buy orderbook if orderType is SELL, and the sell orderbook if order type is BUY.
   */
  secondaryOrderbookDB(orderType: OrderTypes): Book {
    if (orderType === OrderTypes.BUY)
      return this.sellbook;
    return this.buybook;
  }

  /**
   * retrieve the orderbook of the same order type.
   * @param {OrderTypes} orderType order type.
   * @returns {Book} returns the buy orderbook if orderType is BUY, and the sell orderbook if order type is SELL.
   */
  ordeerbookDB(orderType: OrderTypes): Book {
    if (orderType === OrderTypes.BUY)
      return this.buybook;
    return this.sellbook;
  }

  /**
   * add new order to price slot.
   * @param {Order} order the new order.
   * @returns {void}
   */
  addOrderToExistingPriceSlot(order: Order) {
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
  isPriceSlotExisting(order: Order): boolean {
    return this.ordeerbookDB(order.orderType).has(order.price);
  }


  /**
   * handle order subtraction from an existing price slot accumulatively.
   * @param {Order} order the new order.
   * @param {Order[]} priceSlot the targeted price slot.
   * @returns {Order} return the order with the remaining amount after processing.
   */
  consumePriceSlot(order: Order, priceSlot: Order[]): Order {
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
  iterateOverBookOrders(order: Order, orderBookEntries): Order{

    const orderSlotItr = orderBookEntries.next();
    const orderSlot = orderSlotItr.value;
    if (orderSlotItr.done || order.amount <= 0) {
      return order;
    } else {
      const [slotPrice, slot] = orderSlot;
      if ((order.orderType === OrderTypes.BUY && slotPrice <= order.price) || order.orderType === OrderTypes.SELL && slotPrice >= order.price) {
        const orderRemaining = this.consumePriceSlot(order, slot);
        if (orderRemaining.amount > 0) {

          this.iterateOverBookOrders(orderRemaining, orderBookEntries);
        }
      } else {
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
  consumeOrder(order: Order) {
    const consumableOrderType = order.orderType === OrderTypes.BUY ? OrderTypes.SELL : OrderTypes.BUY;
    const orderBookEntries = this.ordeerbookDB(consumableOrderType).entries();
    const orderLeftOver = this.iterateOverBookOrders(order, orderBookEntries);
    console.log('orderLeftOver:', orderLeftOver);
    if (orderLeftOver.amount > 0)
      this.addNewOrder(order);
  }
}
