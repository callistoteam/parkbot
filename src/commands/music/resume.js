const Command = require('../../structures/Command')

module.exports = class Resume extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'resume' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ client, message }){
        const player = await client.music.playerCollection.get(message.guild.id)
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        player.resume()
        message.channel.send('음악을 다시 재생할게!')
    }
}