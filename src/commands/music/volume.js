const { Command } = require('../../utils')

module.exports = class Volume extends Command {
    constructor(client){
        super(client)
        this.alias = [ '볼륨', 'volume', 'vol', 'v' ]
        this.permission = 0x0
        this.category = 'music'
        this.args = [ { name: '볼륨', required: true } ]
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher)
            return await message.reply('이 길드에서 재생중인 음악이 없어 :(')
        if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID)
            return await message.reply('다른 채널에서 음악이 재생중이야.')

        if (!message.data.args || isNaN(message.data.args)) 
            return await message.channel.send(`현재 볼륨은 \`${dispatcher.link.player.volume}%\`야.`)
        const volume = Number(message.data.args)
        if (volume < 1 || volume > 100)
            return await message.reply('볼륨은 0부터 100 사이의 정수여야해.')
        await dispatcher.player.setVolume(volume)
        await message.reply(`볼륨이 \`${volume}%\`로 설정되었어.`)
    }
}