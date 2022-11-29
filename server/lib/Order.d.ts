export declare enum OrderTypes {
    BUY = 0,
    SELL = 1,
    CANCELL = 2
}
export interface Order {
    id: string;
    orderType: OrderTypes;
    symbol: string;
    price: number;
    amount: number;
}
