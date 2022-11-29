enum OrderTypes {
 BUY,
 SELL,
 CANCELL
}
interface Order {
 id: string,
 orderType: OrderTypes,
 symbol: string,
 price: number,
 amount: number,
}