const { Command, Formats } = require('../../utils')

var insertlog = async (client, message, track) => {
    let usrdata = await client.knex('users').where({ id: message.author.id }).then(a => a[0])
    console.log(track)
    let pl = JSON.parse(usrdata.log).log
    pl.push(`${track.info.title} : ${track.info.identifier}`)
    await client.knex('users').update({ log: `{"log": ${JSON.stringify(pl)}}`}).where({ id: message.author.id })
}

module.exports = class Play extends Command {
    constructor(client){
        super(client)
        this.alias = [ '재생', 'play', 'p' ]
        this.permission = 0x0
        this.category = 'music'
        this.args = [ { name: '곡명 또는 URL', required: true } ]
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
            insertlog(client, message, track)
            if (res) await res.play()
            return
        }
        const searchData = await node.rest.resolve(query, 'youtube')
        if (!searchData.tracks.length)
            return await message.channel.send('검색 결과가 없어. 더 간단하거나 자세하게 검색해봐.')
        const track = searchData.tracks.shift()
        const res = await client.queue.handle(node, track, message)
        insertlog(client, message, track)
        await message.channel.send(`🎵 \`${track.info.title}\`을(를) 대기열에 추가했어.`).catch(() => null)
        
        if (res) await res.play()
    }
}