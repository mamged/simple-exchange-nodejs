import OrderBook, { OrderBookOptions } from './OrderBook';
import { OrderBookLevelState } from './OrderBookLevel';

type Book = Map<number, [Order]>;
/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
export class OrderBooksStore {
  book: Book;

  constructor(options?: OrderBookOptions) {
    this.book = new Map<number, [Order]>();
  }

  /**
   * @param {string} symbol
   * @returns {OrderBook} created for symbol if not already tracked
   */
  public getBook(): [number, [Order]][] {
    return Array.from(this.book);
  }
  addNewOrder(order: Order) {
    if (this.isPriceExisting(order.price)) {
      this.addOrderToExistingPriceSlot(order)
    }
    else this.addNewOrder(order);
  }
  addNewOrderSlot(order: Order){
    this.book.set(order.price, [order]);
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
  consumeOrder(order: Order){
    if(this.isPriceExisting(order.price)){
      
    }
  }
}
