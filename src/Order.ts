export enum OrderTypes {
 BUY,
 SELL,
 CANCELL
}
export interface Order {
 id: string,
 orderType: OrderTypes,
 symbol: string,
 price: number,
 amount: number,
}