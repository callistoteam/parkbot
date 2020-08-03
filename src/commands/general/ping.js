const Command = require("../../structures/Command")
const Discord = require("discord.js")

module.exports = class Ping extends Command {
    alias = [ "ping", "핑" ]
    permission = 0x0
    category = "general"

    async execute({ client, message }){
        try{
            const m = await message.channel.send("잠시만 기다려주세요").then(async msg => {
            let pingembed = new Discord.MessageEmbed()
            .setTitle("퐁!")
            .setColor("RANDOM")
            .addField("지연 시간", `${msg.createdTimestamp - message.createdTimestamp}ms`)
            .addField("API지연시간", `${client.ws.ping}ms`)
            pingembed.setTimestamp()
            msg.edit("", pingembed)
          })
        }catch(e) {
            message.channel.send("오류")
            console.log(e)
        }
    }
}