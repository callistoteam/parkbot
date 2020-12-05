const { Command } = require('../../utils')

module.exports = class Resume extends Command {
    constructor(client){
        super(client)
        this.alias = [ '일시정지해제', 'resume' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher) return await message.channel.send('이 길드에서 재생중인 음악이 없어 :(')

        dispatcher.setPaused(false)

        message.reply('> 음악을 다시 재생할게!')
    }
}