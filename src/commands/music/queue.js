const { Command, Embed } = require('../../utils')

module.exports = class Queue extends Command {
    constructor(client){
        super(client)
        this.alias = [ '대기열', 'q', 'queue' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher) return await message.channel.send('이 길드에서 재생중인 음악이 없어 :(')
        
        message.reply(new Embed(message).viewQueue(dispatcher))
    }
}