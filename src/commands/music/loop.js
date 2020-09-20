const { Command } = require('../../utils')

module.exports = class Loop extends Command {
    constructor(client){
        super(client)
        this.alias = [ '반복', 'repeat', 'loop' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        player.loop = !player.loop
        message.channel.send(`반복이 \`${player.loop ? '활성화' : '비활성화'}\` 되었어!`)
    }
}