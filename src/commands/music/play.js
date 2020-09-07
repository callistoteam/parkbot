const { Command } = require('../../structures')
const utils = require('../../utils')
const hangul = require('hangul-tools')
const yts = require('yt-search')
// eslint-disable-next-line
const config = require('../../../config')

module.exports = class Play extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'play', 'p', 'ㅔㅣ묘' ]
        this.permission = 0x0
        this.voiceChannel = true
        this.args = [ { name: '곡명 또는 URL', required: true } ]
        this.category = 'music'
    }

    async execute({ client, message }){
        const { channel } = message.member.voice
        if (!channel.joinable || !channel.speakable) return message.reply('봇이 해당 채널에 접속할 수 없습니다.')
        let player

        if(config.client.blackcows.includes(message.author.id)){
            player = await client.premiumMusic.spawnPlayer(
                {
                    guild: message.guild,
                    voiceChannel: channel,
                    textChannel: message.channel,
                    volume: 50,
                    deafen: false
                },
                {
                    skipOnError: true
                }
            )
        } else{
            player = await client.music.spawnPlayer(
                {
                    guild: message.guild,
                    voiceChannel: channel,
                    textChannel: message.channel,
                    volume: 50,
                    deafen: true
                },
                {
                    skipOnError: false
                }
            )
        }
        let res
        try{
            if(utils.Formats.validURL(message.data.arg[0])) {
                res = await player.lavaSearch(encodeURI(message.data.arg[0]), message.member, {
                    source: 'yt'|'sc',
                    add: true
                })
                await player.queue.add(res[0])
                message.reply(`🎵 \`${res[0].title}\`${hangul.josa(res[0].title, '을를')} 큐에 추가했어!`)
            } else {
                var opts = { query: message.data.args }
                await yts( opts, async function ( err, r ) {
                    if ( err ) return message.reply('다른 키워드로 검색해줘.')
                    res = await player.lavaSearch(r.videos[0].url, message.member, {
                        source: 'yt'|'sc',
                        add: true
                    })
                    await player.queue.add(res[0])
                    message.reply(`🎵 \`${res[0].title}\`${hangul.josa(res[0].title, '을를')} 큐에 추가했어!`)
                    if(!player.playing) player.play()
                } )
            }
            // eslint-disable-next-line
        } catch {
            return message.channel.send('처리중에 오류가 발생한거같아.')
        }
    }
}