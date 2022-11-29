declare class OrderBook {
    symbol: string;
    constructor(symbol: string);
    buy(): void;
    sell(): void;
}
