const { Command } = require('../../utils')

module.exports = class Stop extends Command {
    constructor(client){
        super(client)
        this.alias = [ '정지', 'stop' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher)
            return await message.reply('해당 서버에서 재생중인 음악이 없는거같아.')
        if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID)
            return await message.reply('다른 채널에서 음악이 재생중이야.')
        dispatcher.queue.length = 0
        await dispatcher.player.stopTrack()
    }
}