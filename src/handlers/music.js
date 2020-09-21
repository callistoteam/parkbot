const { LavaClient } = require('@anonymousg/lavajs')
const { Embed } = require('../utils')

module.exports = async (client, knex, commands) => {
    client.music = new LavaClient(client, client.config.lavalink.nodes)
    client.premiumMusic = new LavaClient(client, client.config.lavalink.premiumnodes)
    await [client.music, client.premiumMusic].map(async (server) => {
        server.on('nodeSuccess', (node) => {
            console.log(`[INFO] Node connected: ${node.options.host}`)
        })
        
        server.on('nodeError', console.error)

        server.on('trackPlay', async (track, player) => {
            const { title, length, uri, thumbnail, user } = track
            const guild = player.options.guild.id
            // console.log(uri)
            // return player.options.textChannel.send(`${title}을 재생할게`)
            return player.options.textChannel.send(await new Embed().trackPlay(title, length, uri, thumbnail, user, guild, knex))
        })
    
        server.on('queueOver', async (player) => {
            // console.log(player.options.guild.id)
            if(player.loop) {
                let knexresult = await client.knex('guild').select(['id', 'uri']).then(aaaa => aaaa.find(aaaaa => aaaaa.id == player.options.guild.id))
                let res = await player.lavaSearch(encodeURI(knexresult.uri), '음악 반복', {
                    source: 'yt'|'sc',
                    add: true
                })
                await player.queue.add(res[0])
                if(!player.playing) player.play()
                return
            }
            player.destroy()
            player.options.textChannel.send(
                new Embed().queueEnd()
            )
        })
    })
}