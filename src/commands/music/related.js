const { Command } = require('../../utils')
const siruScraper = require('@sirubot/yt-related-scraper').Client

var insertlog = async (client, message, track) => {
    let usrdata = await client.knex('users').where({ id: message.author.id }).then(a => a[0])
    // console.log(track)
    let pl = JSON.parse(usrdata.log).log
    pl.push(`${track.info.title} : ${track.info.identifier}`)
    await client.knex('users').update({ log: `{"log": ${JSON.stringify(pl)}}`}).where({ id: message.author.id })
}

module.exports = class Related extends Command {
    constructor(client){
        super(client)
        this.alias = [ '추천영상', 'related' ]
        this.permission = 0x0
        this.category = 'music'
        this.voiceChannel = true
    }

    async execute({ client, message }){
        const dispatcher = client.queue.get(message.guild.id)
        if (!dispatcher) return await message.channel.send('이 길드에서 재생중인 음악이 없어 :(')

        const results = await siruScraper.get(dispatcher.current.info.uri)

        let msg = await message.channel.send(`> ${results.length}개의 영상을 추가하고있어.`)

        results.map(async (music) => {
            const node = client.shoukaku.getNode()
            const result = await node.rest.resolve(music.uri)
            if (!result)
                return await message.channel.send('> 몇몇개의 영상을 불러오는데에 실패했어. `#q` 커맨드로 실제 추가된 음악들을 확인해봐.')
            const { tracks } = result
            const track = tracks.shift()
            const res = await client.queue.handle(node, track, message)

            insertlog(client, message, track)
            if (res) await res.play()
            return
        })

        msg.edit(`${results.length}개의 영상을 큐에 추가했어.
        
        > 음악이 아닌 영상이 큐에 추가 되었을 수 있어. \`#q\`커맨드를 통해 추가된 음악들을 확인해봐.
        > 제일 좋은 방법은 이 기능을 이용하지 않고 유튜브가 생성해준 플레이리스트를 이용하는거야.
        > 자세히보기 : <https://parkbot.ml/docs/youtube-related>
        `)
    }
}