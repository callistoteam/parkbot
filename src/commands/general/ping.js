const Command = require("../../structures/Command");

module.exports = class Ping extends Command {
    alias = [ "ping", "핑" ]
    permission = 0x0

    async execute({ client, message }){
        try{
            const m = await message.channel.send("<a:loadingforpark:702385005590085632> 잠시만 기다려주세요").then(async msg => {
            let pingembed = new Discord.MessageEmbed()
            .setTitle("퐁!")
            .setColor("RANDOM")
            .addField("지연 시간", `${msg.createdTimestamp - message.createdTimestamp}ms`)
            pingembed.setTimestamp()
            msg.edit("Pong")
            msg.edit(pingembed)
          })
        }catch(e) {
            message.channel.send("오류")
            console.log(e)
        }
    }
}