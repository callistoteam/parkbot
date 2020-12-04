const { Command, Btm, Embed } = require('../../utils')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

module.exports = class Nodeinfo extends Command {
    constructor(client){
        super(client)
        this.alias = [ '노드정보', 'nodeinfo', 'ni' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ client, message }){
        const embed = new Embed(message).sample()

        for (const node of client.music.nodes.values()) {
            var rp = `${node.stats.players} players of ${node.stats.playingPlayers}`
            embed.addField(`**${node.name}** ${rp} playing`, 
                `**${Btm(node.stats.memory.used)}** Used
            **${node.stats.cpu.cores}** Cores
            **${this.toFixed(node.stats.cpu.lavalinkLoad)}%** Lavalink Loads
            **${moment.duration(node.stats.uptime).format('DD일 HH시간 mm분 ss초')}** Uptime`
            )
        }
        
        await message.channel.send(embed)
    }

    toFixed (load) {
        return Number(load * 100).toFixed(2)
    }
}
