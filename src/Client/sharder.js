const { ShardingManager } = require('discord.js')

module.exports = class ParkBotClient {
    constructor( config ) {
        if(!config) throw '[ERR0R] "config" is not given'
        this.initialized = false
        this.manager = new ShardingManager('./src/Client/bot.js', { token: config.client.token, totalShards: 2 })
    }

    async init() {
        if(this.initialized) throw 'Aleady initiallized.'
        else this.initialized = true

        this.manager.on('shardCreate', shard => console.log(`[LOAD] Launched shard ${shard.id}`))
        this.manager.spawn()
    }
}
