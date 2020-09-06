const Command = require('../../structures/Command')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class Help extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'help', '도움말' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ client, message }){
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .addField('링크', '[초대하기](https://parkbot.ml)\n[지원 서버](https://discord.gg/jE33mfD)\n[이용약관](https://callisto.team/tos)\n[개인정보 처리방침](https://parkbot.ml/privacy)\n[프리미엄 구매하기](https://premium.parkbot.ml)')

        const commands = (category) => {
            return client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `\`${client.prefix}${cmd.alias[0]}\``)
                .join(', ')
        }

        const info = ['dev', 'general', 'music']
            .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
            .reduce((string, category) => string + '\n' + category)

        return message.channel.send(embed.setDescription(info))
    }
}