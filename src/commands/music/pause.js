const Command = require('../../structures/Command')

module.exports = class Pause extends Command {
    constructor(client){
        super(client)
        this.alias = [ '일시정지', 'pause' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        player.pause()
        message.channel.send('> 음악을 일시정지했어. `#resume`으로 다시 재생해봐!')
    }
}