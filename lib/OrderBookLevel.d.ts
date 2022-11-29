declare type Symbol = string;
declare type Price = number;
declare type Side = 'Buy' | 'Sell';
declare type Quantity = number;
export declare type OrderBookLevelState<T = unknown> = [
    Symbol,
    Price,
    Side,
    Quantity,
    (T[] | any)?
];
/**
 * One level in orderbook
 * @param {string} symbol
 * @param {number} price
 * @param {string} [side='Buy'|'Sell']
 * @param {number} qty asset at this level
 */
export declare function OrderBookLevel<T>(symbol: string, price: number, side: Side, qty: Quantity, ...extraState: T[]): OrderBookLevelState<T>;
export {};
