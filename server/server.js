// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { consumeSellOrder, consumeBuyOrder, getOrderBook } = require('./orderbook')


const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
    timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

setInterval(function() {
    link.announce('rpc_test', service.port, {});
    console.log('service.port', service.port);
}, 1000)

service.on('request', (rid, key, payload, handler) => {
    console.log(payload) //  { msg: 'hello' }
    if (payload.transationType === 'BUY') {
        consumeBuyOrder(payload.transactionData)
    } else consumeSellOrder(payload.transactionData)
    handler.reply(null, { orderbook: getOrderBook() })
})