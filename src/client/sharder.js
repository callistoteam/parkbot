const { ShardingManager } = require('discord.js')

module.exports = class ParkBotSharder {
    constructor( config ) {
        if(!config) throw '[ERROR] "config" is not given'
        this.initialized = false
        this.manager = new ShardingManager('./src/client/bot.js', { token: config.client.token, totalShards: config.client.totalShards })
    }

    async init() {
        if(this.initialized) throw 'Aleady initiallized.'
        else this.initialized = true

        this.manager.on('shardCreate', shard => console.log(`[LOAD] Launched shard ${shard.id}`))
        this.manager.spawn()
    }
}
