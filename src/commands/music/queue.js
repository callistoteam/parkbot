const Command = require("../../structures/Command")
const Discord = require("discord.js")

module.exports = class Queue extends Command {
    alias = [ "q", '큐' ]
    permission = 0x0

    async execute({ client, message }){
        const player = await client.music.playerCollection.get(message.guild.id)
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        let data

        for ([ k, v ] of player.queue.KVArray()) {
            const { title, length, uri } = v
            data += `[${k}] [${title}](${uri}) - ${formatTime(length)}\n`
        }

        const queue = new Discord.MessageEmbed()
        .setTitle('큐')
        .addField('곡 리스트', data)

        message.channel.send()
    }
}