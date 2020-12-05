const { Command } = require('../../utils')

module.exports = class Pause extends Command {
    constructor(client){
        super(client)
        this.alias = [ '일시정지', 'pause' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher) return await message.channel.send('이 길드에서 재생중인 음악이 없어 :(')

        dispatcher.player.setPaused(true)

        message.reply('> 음악을 일시정지했어. `#resume`커맨드로 일시정지를 해제할 수 있어.')
    }
}