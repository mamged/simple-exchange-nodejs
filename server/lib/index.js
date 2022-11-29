"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrderBook_1 = __importDefault(require("./OrderBook"));
const orderbook = new OrderBook_1.default();
// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'
'use strict';
const { PeerRPCServer } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const { consumeSellOrder, consumeBuyOrder, getOrderBook } = require('./orderbook');
const link = new Link({
    grape: 'http://127.0.0.1:30001'
});
link.start();
const peer = new PeerRPCServer(link, {
    timeout: 300000
});
peer.init();
const port = 1024 + Math.floor(Math.random() * 1000);
const service = peer.transport('server');
service.listen(port);
setInterval(function () {
    link.announce('rpc_test', service.port, {});
}, 1000);
service.on('request', (rid, key, payload, handler) => {
    console.log(payload); //  { msg: 'hello' }
    orderbook.consumeOrder(payload);
    handler.reply(null, orderbook.getBook());
});
console.log('server started..');
//# sourceMappingURL=index.js.map