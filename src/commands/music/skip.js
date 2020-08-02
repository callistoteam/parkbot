const Command = require("../../structures/Command");

module.exports = class Skip extends Command {
    alias = [ "skip", "s", '스킵' ]
    permission = 0x0
    voiceChannel = true
    category = "music"

    async execute({ client, message }){
        const player = await client.music.playerCollection.get(message.guild.id)
        if(!player) return message.reply(`이 서버에서 재생중인 음악이 없어!`)

        if(player.queue.size === 0) return message.reply('스킵한 후에 재생할 곡이 없어!')

        await player.play()
        return message.reply('하나의 곡을 건너뛰었어.')
    }
}