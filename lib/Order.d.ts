declare enum OrderTypes {
    BUY = 0,
    SELL = 1,
    CANCELL = 2
}
interface Order {
    id: string;
    orderType: OrderTypes;
    symbol: string;
    price: number;
    amount: number;
}
