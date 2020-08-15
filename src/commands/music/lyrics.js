const Command = require('../../structures/Command')
const { Embed } = require('../../structures')
const Lyrics = require('slyrics')
const lyrics = new Lyrics()

async function search (provider, title) {
    const result = await lyrics.get(provider, title)
    return result
}

module.exports = class Lyrics extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'lyrics', '가사' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message }){
        if(!message.data.args) return message.reply("가사를 검색할 음악 제목을 입력해줘!")
        message.channel.send(new Embed(message).lyrics(await search('melon', message.data.args)))
    }
}