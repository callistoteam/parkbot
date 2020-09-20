const { Command, Embed } = require('../../utils')

module.exports = class Nowplay extends Command {
    constructor(client){
        super(client)
        this.alias = [ '현재재생', 'nowplaying', 'nowplay', 'np', 'ㅞ' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        let server = '알 수 없음'
        /* if(player.node.options.host.includes('org')){
            server = 'Premium'
        } else {
            server = 'Normal'
        } */

        message.channel.send(new Embed(message).nowPlay(player, server))
    }
}