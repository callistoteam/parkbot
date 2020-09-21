const { Command, Embed } = require('../../utils')
const Lyrics = require('slyrics')
const lyrics = new Lyrics()

async function search (provider, title) {
    const result = await lyrics.get(provider, title)
    return result
}

module.exports = class Lyrics extends Command {
    constructor(client){
        super(client)
        this.alias = [ '가사', 'lyrics' ]
        this.permission = 0x0
        this.args = [ { name: '곡명', required: true } ]
        this.category = 'music'
    }

    async execute({ message }){
        try{
            message.channel.send(new Embed(message).lyrics(await search('melon', message.data.args)))
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        } catch {
            message.channel.send('검색된 음악이 없어. 확인 후 다시 시도해줘.')
        }
    }
}