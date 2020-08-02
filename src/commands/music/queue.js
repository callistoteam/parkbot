const Command = require("../../structures/Command")
const Discord = require("discord.js")
const { Embed } = require("../../structures")

module.exports = class Queue extends Command {
    alias = [ "queue", "q", "큐" ]
    permission = 0x0
    category = "music"

    async execute({ client, message }){
        const player = await client.music.playerCollection.get(message.guild.id)
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        let data = ""

        message.channel.send(new Embed(message).viewQueue(player.queue))
    }
}