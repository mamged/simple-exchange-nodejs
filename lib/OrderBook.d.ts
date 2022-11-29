import { OrderBookLevelState } from './OrderBookLevel';
export interface OrderBookOptions {
    checkTimestamps?: boolean;
    maxDepth?: number;
    /** Whether to console.log when a snapshot or delta is processed */
    traceLog?: boolean;
}
/**
 * Storage helper to store/track/manipulate the current state of an symbol's orderbook
 * @class OrderBook
 */
export default class OrderBook {
    symbol: string;
    book: OrderBookLevelState<undefined>[];
    shouldCheckTimestamps: boolean;
    lastUpdateTimestamp: number;
    maxDepth: number;
    constructor(symbol: string, options?: OrderBookOptions);
    /**
     * @public Process orderbook snapshot, replacing existing book in memory
     * @param {OrderBookLevelState[]} current orderbook snapshot represented as array, where each child element is a level in the orderbook
     * @param {number} timestamp
     */
    handleSnapshot<ExtraStateType = unknown>(data: OrderBookLevelState<ExtraStateType>[], timestamp?: number): this;
    /**
     * @public Process orderbook delta change, either deleting, updating or inserting level data into the existing book. Price is used on each level to find existing index in tracked book state.
     *
     * @param {Array} [deleteDelta=[]] levels to delete
     * @param {Array} [updateDelta=[]] levels to update
     * @param {Array} [insertDelta=[]] levels to insert
     * @param {number} timestamp
     */
    handleDelta(deleteDelta?: OrderBookLevelState[], updateDelta?: OrderBookLevelState[], insertDelta?: OrderBookLevelState[], timestamp?: number): this;
    /**
     * @private replace item at index, mutating existing book store
     */
    private replaceLevelAtIndex;
    /**
     * @private insert item, mutating existing book store
     */
    private insertLevel;
    /**
     * @private find index of level in book, using "price" property as primary key
     * @param {object} level
     * @returns {number} index of level in book, if found, else -1
     */
    private findIndexForSlice;
    /**
     * @public throw error if current timestamp is older than last updated timestamp
     * @param {number} timestamp
     */
    checkTimestamp(timestamp: number): false | undefined;
    /** Sort orderbook in memory, lowest price last, highest price first */
    private sort;
    /** trim orderbook in place to max depth, evenly across both sides */
    private trimToMaxDepth;
    /**
     * Trim edges of orderbook to total target
     *
     * @param {number} [totalToTrim=0]
     * @param {boolean} shouldTrimTop - if true, trim from array beginning (top = sells) else from array end (bottom = buys)
     */
    private trimSideCount;
    /** Track last updated timestamp */
    private trackDidUpdate;
    /** dump orderbook state to console */
    print(): this;
    /** empty current orderbook store to free memory */
    reset(): this;
    /**
     * get lowest sell order
     * @param {number} [offset=0] offset from array centre (should be positive)
     * @returns {number} lowest seller price
     */
    getBestAsk(offset?: number): number | null;
    /**
     * get highest buy order price
     * @param {number} [offset=0] offset from array centre (should be positive)
     * @returns {number} highest buyer price
     */
    getBestBid(offset?: number): number | null;
    /**
     * get current bid/ask spread percentage
     * @param {number} [n=0] offset from centre of book
     * @returns {number} percentage spread between best bid & ask
     */
    getSpreadPercent(n?: number): number | null;
}
