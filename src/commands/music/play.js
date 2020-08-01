const Command = require("../../structures/Command");
const yts = require("yt-search")

module.exports = class Play extends Command {
    alias = [ "p", 'ㅔㅣ묘' ]
    permission = 0x0

    async execute({ client, message }){
        const { channel } = message.member.voice
        if (!channel) return message.reply(`먼저 음성 채널에 접속해줘!`)
        if (!channel.joinable || !channel.speakable) return message.reply('봇이 해당 채널에 접속할 수 없습니다.')

        const player = await client.music.spawnPlayer(
            {
                guild: message.guild,
                voiceChannel: channel,
                textChannel: message.channel,
                volume: 50,
                deafen: true
            },
            {
                skipOnError: true
            }
        )

        let res
        try {
            res = await player.lavaSearch(song, message.member, {
                source: 'yt',
                add: true
            })
        } catch (e) {
            if (e)
                return await message.channel.send('음악을 찾을 수 없습니다.')
        }
    }
}