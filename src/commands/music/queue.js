const Command = require('../../structures/Command')
const { Embed } = require('../../structures')

module.exports = class Queue extends Command {
    constructor(client){
        super(client)
        this.alias = [ '대기열', 'queue', 'q', '큐' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        message.channel.send(new Embed(message).viewQueue(player.queue))
    }
}