const { Command } = require('../../utils')

module.exports = class Skip extends Command {
    constructor(client){
        super(client)
        this.alias = [ '스킵', 'skip', 'sk' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher)
            return await message.channel.send('이 길드에서 재생중인 음악이 없어 :(')
        if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID)
            return await message.reply('다른 채널에서 음악이 재생중이야.')

        message.reply('곡 한 개를 스킵했어.')
        await dispatcher.player.stopTrack()
    }
}