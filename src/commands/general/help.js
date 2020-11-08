const { Command } = require('../../utils')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class Help extends Command {
    constructor(client){
        super(client)
        this.alias = [ '도움말', 'help', '도움' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ client, message }){
        if(message.data.arg[0]) {
            let command1 = client.commands.filter(cmd => cmd.alias.includes(message.data.arg[0]))
            let command = await command1.map(aa => aa)[0]
            console.log(command)
            let usage
            if(command.args){
                usage = `${client.config.client.prefix}${message.data.arg[0]} ${command.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`)}`   
            } else {
                usage = `${client.config.client.prefix}${message.data.arg[0]}`
            }
            const embed = new MessageEmbed()
                .setTitle(`\`${message.data.arg[0]}\`커맨드의 정보`)
                .addField('카테고리', command.category)
                .addField('다른 사용법들', `\`${command.alias.join('`, `')}\``)
                .addField('사용법', usage)

            return message.reply(embed)
        }
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .addField('유용한 링크', '[초대하기](https://parkbot.ml)\n[지원 서버](https://discord.gg/jE33mfD)\n[이용약관](https://parkbot.ml/tos)\n[개인정보 처리방침](https://parkbot.ml/privacy)')
        
        let commands = (category) => {
            return client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `\`${client.prefix}${cmd.alias[0]}\``)
                .join(', ')
        }

        const info = ['general', 'music', 'useful']
            .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
            .reduce((string, category) => string + '\n' + category)

        return message.channel.send(embed.setDescription(info))
    }
}