const { Command, Formats } = require('../../utils')

module.exports = class Play extends Command {
    constructor(client){
        super(client)
        this.alias = [ '재생', 'play' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        if (!message.data.args) return await message.channel.send('검색할 음악 제목을 알려줘')
        const node = client.shoukaku.getNode()
        const query = message.data.args
        if (Formats.validURL(query)) {
            const result = await node.rest.resolve(query)
            if (!result)
                return await message.channel.send('검색 결과가 없어. 더 간단하거나 자세하게 검색해봐.')
            const { type, tracks, playlistName } = result
            const track = tracks.shift()
            const isPlaylist = type === 'PLAYLIST'
            const res = await client.queue.handle(node, track, message)
            if (isPlaylist) {
                for (const track of tracks) await client.queue.handle(node, track, message)
            }   
            await message.channel.send(isPlaylist ? `**${playlistName}** 플레이리스트를 큐에 추가했어` : `**${track.info.title}**을(를) 큐에 추가했어.`)
                .catch(() => null)
            if (res) await res.play()
            return
        }
        const searchData = await node.rest.resolve(query, 'youtube')
        if (!searchData.tracks.length)
            return await message.channel.send('검색 결과가 없어. 더 간단하거나 자세하게 검색해봐.')
        const track = searchData.tracks.shift()
        const res = await client.queue.handle(node, track, message)
        await message.channel.send(`🎵 \`${track.info.title}\`을(를) 대기열에 추가했어.`).catch(() => null)
        if (res) await res.play()
    }
}