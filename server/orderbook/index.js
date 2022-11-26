var sellOrders = new Map();
var sellOrdersKeysOrdered = [];
var buyOrders = new Map();
var buyOrdersKeysSorted = [];

function registerBuyOrder(order) {
    if (buyOrders.has(order.price)) {
        const existingOrder = buyOrders.get(order.price);
        existingOrder.quantity = existingOrder.quantity + order.quantity;
        buyOrders.set(order.price, existingOrder);
    } else buyOrders.set(order.price, { quantity: order.quantity });
    buyOrdersKeysSorted = Array.from(buyOrders.keys()).sort((a, b) => a > b ? 1 : -1);
}

function registerSellOrder(order) {
    if (sellOrders.has(order.price)) {
        const existingOrder = sellOrders.get(order.price);
        existingOrder.quantity = existingOrder.quantity + order.quantity;
        sellOrders.set(order.price, existingOrder);
    } else sellOrders.set(order.price, { quantity: order.quantity });
    sellOrdersKeysOrdered = Array.from(sellOrders.keys()).sort((a, b) => a > b ? 1 : -1);
}

function consumeSellQuantity(buyPriceSlots, orderQuantity) {
    const remainingOrderQuantity = orderQuantity - buyPriceSlots.quantity;
    return {
        remainingbuyPriceSlots: remainingOrderQuantity > 0 ? { quantity: 0 } : { quantity: buyPriceSlots.quantity - orderQuantity },
        remainingOrderQuantity: remainingOrderQuantity > 0 ? remainingOrderQuantity : 0,
    };
}

function consumeBuyQuantity(sellPriceSlots, orderQuantity) {
    if (!sellPriceSlots) debugger;
    const remainingOrderQuantity = orderQuantity - sellPriceSlots.quantity;
    return {
        remainingsellPriceSlots: remainingOrderQuantity == 0 ? { quantity: 0 } : { quantity: sellPriceSlots.quantity - orderQuantity },
        remainingQuantity: remainingOrderQuantity <= 0 ? 0 : remainingOrderQuantity,
    };
}

function consumeSellOrder(order) {
    if (buyOrdersKeysSorted[0] >= order.price) {
        const buyPriceSlots = buyOrders.get(buyOrdersKeysSorted[0]);
        const { remainingbuyPriceSlots, remainingOrderQuantity } = consumeSellQuantity(buyPriceSlots, order.quantity);
        if (remainingbuyPriceSlots.quantity > 0) {
            buyOrders.set(buyOrdersKeysSorted[0], remainingbuyPriceSlots)
        } else if (remainingbuyPriceSlots.quantity <= 0) {
            buyOrders.delete(buyOrdersKeysSorted[0]);
            buyOrdersKeysSorted = buyOrdersKeysSorted.splice(1);
            remainingOrderQuantity > 0 && consumeSellOrder({...order, quantity: remainingOrderQuantity });
        }
    } else registerSellOrder(order);
}

function consumeBuyOrder(order, startingOrderRow = 0) {
    if (startingOrderRow >= sellOrdersKeysOrdered.length) {
        registerBuyOrder(order);
        return;
    }
    if (sellOrdersKeysOrdered[startingOrderRow] <= order.price) {
        if (!sellOrders.get(sellOrdersKeysOrdered[startingOrderRow])) debugger
        const sellPriceSlots = sellOrders.get(sellOrdersKeysOrdered[startingOrderRow]);
        const { remainingsellPriceSlots, remainingQuantity } = consumeBuyQuantity(sellPriceSlots, order.quantity);
        if (remainingsellPriceSlots.quantity > 0) {
            sellOrders.set(sellOrdersKeysOrdered[startingOrderRow], remainingsellPriceSlots)
        } else if (remainingsellPriceSlots.quantity <= 0) {
            sellOrders.delete(sellOrdersKeysOrdered[startingOrderRow]);
            sellOrdersKeysOrdered = sellOrdersKeysOrdered.splice(1);
            remainingQuantity > 0 && consumeBuyOrder({...order, quantity: remainingQuantity }, startingOrderRow + 1);
        }
    } else {
        if (order.price > sellOrdersKeysOrdered[sellOrdersKeysOrdered.length - 1]) {
            if (startingOrderRow < sellOrdersKeysOrdered.length - 1)
                consumeBuyOrder(order, startingOrderRow + 1)
            else
                registerBuyOrder(order);
        } else
            registerBuyOrder(order);
    }
}

function getOrderBook() {
    return {
        buyOrders: buyOrders.entries(),
        sellOrders: sellOrders.entries(),
    }
}
module.exports = {
    consumeSellOrder,
    consumeBuyOrder,
    getOrderBook,
}