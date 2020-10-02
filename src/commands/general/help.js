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
            let abcd = message.data.arg[0].replace('#', '')
            let command1 = client.commands.filter(cmd => cmd.alias.includes(abcd))
            let command = await command1.map(aa => aa)[0]
            if(!command) return message.reply('없는 커맨드같아. 다시 확인해줘!')
            let usage
            if(command.args){
                usage = `${client.config.client.prefix}${abcd} ${command.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`)}`   
            } else {
                usage = `${client.config.client.prefix}${abcd}`
            }
            const embed = new MessageEmbed()
                .setTitle(`\`${abcd}\`커맨드의 정보`)
                .addField('카테고리', command.category)
                .addField('다른 사용법들', `\`${command.alias.join('`, `')}\``)
                .addField('사용법', `\`${usage}\``)
                .setColor('RANDOM')

            return message.reply(embed)
        }
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .addField('유용한 링크', '[초대하기](https://parkbot.ml)\n[문의](http://support.parkbot.ml)\n[이용약관](https://callisto.team/tos)\n[개인정보 처리방침](https://parkbot.ml/privacy)')
            .setFooter('`#help [커맨드]`로 자세한 도움말을 확인할 수 있어!')
        
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