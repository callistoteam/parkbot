const Command = require('../../structures/Command')
const Discord = require('discord.js')

module.exports = class Ping extends Command {
    constructor(client){
        super(client)
        this.alias = [ '핑', 'ping' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ client, message }){
        try{
            await message.channel.send('잠시만 기다려주세요').then(async msg => {
                let pingembed = new Discord.MessageEmbed()
                    .setTitle('퐁!')
                    .setColor('RANDOM')
                    .addField('지연 시간', `${msg.createdTimestamp - message.createdTimestamp}ms`)
                    .addField('API지연시간', `${client.ws.ping}ms`)
                pingembed.setTimestamp()
                msg.edit('', pingembed)
            })
        }catch(e) {
            message.reply('알 수 없는 오류가 발생했어요.')
            console.log(e)
        }
    }
}