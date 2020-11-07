const { Shoukaku } = require('shoukaku')
// eslint-disable-next-line node/no-unpublished-require
const config = require('../../config')
const Options = { moveOnDisconnect: false, resumable: false, resumableTimeout: 30, reconnectTries: 5, restTimeout: 10000 }

class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(client, config.lavalink.nodes, Options)

        this.on('ready',
            (name, resumed) =>
                client.logger.log(`Lavalink Node: ${name} is now connected`, `This connection is ${resumed ? 'resumed' : 'a new connection'}`)
        )
        this.on('error',
            (name, error) =>
                client.logger.error(error)
        )
        this.on('close',
            (name, code, reason) =>
                client.logger.log(`Lavalink Node: ${name} closed with code ${code}`, reason || 'No reason')
        )
        this.on('disconnected',
            (name, reason) =>
                client.logger.log(`Lavalink Node: ${name} disconnected`, reason || 'No reason')
        )
    }
}

module.exports = ShoukakuHandler