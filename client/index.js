'use strict'

const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const order = {
    id: '111a34543',
    orderType: 0,
    symbol: 'any',
    price: 100,
    amount: 3,
}
peer.request('rpc_test', order, { timeout: 10000 }, (err, data) => {
    if (err) {
        console.error(err)
        process.exit(-1)
    }
    console.log('client received back:', JSON.stringify(data, null, 2)) // { msg: 'world' }
})