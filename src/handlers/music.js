const { Shoukaku } = require('shoukaku')
// eslint-disable-next-line node/no-unpublished-require
const config = require('../../config')
const ShoukakuOptions = { moveOnDisconnect: false, resumable: false, resumableTimeout: 30, reconnectTries: 2, restTimeout: 10000 };

module.exports = async (client) => {
    client.music = new Shoukaku(this, config.lavalink.nodes, ShoukakuOptions)
}