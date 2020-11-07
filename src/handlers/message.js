const utils = require('../utils')
const uuid = require('uuid')

module.exports = async (client, commands) => {
    client.on('message', async (message) => {
        if(message.author.bot) return

        message.author.data = utils.Database.getUserData(message)
        message.guild.data = utils.Database.getGuildData(message)

        message.data = {
            cmd: message.content.replace(message.guild.data.prefix, '').split(' ').shift(),
            args: message.content.replace(message.guild.data.prefix, '').split(' ').slice(1).join(' '),
            arg: message.content.replace(message.guild.data.prefix, '').split(' ').slice(1),
            authorPerm: utils.Permission.getUserPermission(message.member)
        }

        const cmd = await commands.find(r=> r.alias.includes(message.data.cmd))
        if(!cmd) return
        if(utils.Permission.compare(cmd.permission, message.data.authorPerm)) {
            if(cmd.voiceChannel && !message.member.voice.channel) return message.reply('먼저 음성 채널에 접속해줘!')
            if(cmd.args && cmd.args.length > message.data.arg.length) return message.reply(`누락된 항목이 있습니다.\n\`\`\`사용법: ${client.config.client.prefix}${message.data.cmd} ${cmd.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`)}\`\`\``)

            let premium = message.author.data.premium > new Date
            console.log(premium)
            client.commands = commands
            client.prefix = client.config.client.prefix
            let player = await client.music.playerCollection.get(message.guild.id)
            if(premium) player = await client.premiumMusic.playerCollection.get(message.guild.id)
            cmd.execute({ client, message, player }).catch(e=> {
                console.log(e)
                let errcode = uuid.v1()

                client.channels.cache.get(client.config.client.noticechannel).send(new utils.Embed(message).error(message, e, errcode))
                message.reply(`푸시🤒... 커맨드를 실행하는 도중 오류가 발생했어요.\n\n에러코드: \`${errcode}\``)
            })
        }
        else return message.reply(`해당 커맨드를 실행하려면 퍼미션 \`${cmd.permission}\`이 필요합니다. | 현재 퍼미션: ${message.data.authorPerm}`)
    })
}