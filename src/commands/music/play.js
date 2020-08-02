const { Command, audio } = require("../../structures");
const utils = require('../../utils')

module.exports = class Play extends Command {
    alias = [ "play", "p", 'ㅔㅣ묘' ]
    permission = 0x0
    voiceChannel = true
    args = [ { name: "곡명 또는 URL", required: true } ]
    category = "music"

    async execute({ client, message }){
        const { channel } = message.member.voice
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
            if(utils.Formats.validURL(message.data.arg[0])) {
                res = await player.lavaSearch(encodeURI(message.data.arg[0]), message.member, {
                    source: 'yt'|'sc',
                    add: true
                })
                console.log(res)
                await player.queue.add(res[0])
                message.reply(`Added ${res[0].title}`)
            } else {
                res = await player.lavaSearch(encodeURI(message.data.args), message.member, {
                    source: 'yt'|'sc',
                    add: true
                })
                await player.queue.add(res[0])
                message.reply(`🎵 \`${res[0].title}\`을 큐에 추가했어!`)
            }
            
            if(!player.playing) player.play()
        } catch (e) {
            if (e)
                console.error(e)
                return await message.channel.send('처리중에 오류가 발생하였습니다.')
        }
    }
}