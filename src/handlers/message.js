const utils = require('../utils')

module.exports = async (client, knex, commands) => {
    client.on('message', async (message) => {
        if(message.author.bot) return

        let guilddb = await client.knex('guild').select(['id', 'uri', 'prefix'])
        let guilddata = guilddb.find(as => as.id == message.guild.id)
        if(!guilddata) {
            await knex('guild').insert({id: message.guild.id, uri: '', prefix: '#'})
            guilddb = await client.knex('guild').select(['id', 'uri', 'prefix'])
            guilddata = guilddb.find(as => as.id == message.guild.id)
        }
        
        let prefix
        if(message.content.startsWith(client.config.client.prefix)) {
            prefix = client.config.client.prefix
        }
        if(message.content.startsWith(guilddata.prefix)) {
            prefix = guilddata.prefix
        }
        if(!prefix) return
        let userdata = await client.knex('users').select(['id', 'premium', 'blacklist', 'color'])
        let authordata = userdata.find(yy => yy.id == message.author.id)

        try{
            if(authordata.blacklist == 1) return message.reply('블랙리스트된 유저.\n이의제기: <yoru@outlook.kr>')
            // eslint-disable-next-line
        } catch {
            await client.knex('users').insert({id: message.author.id, premium: '1601827684505', blacklist: '0'})
            userdata = await client.knex('users').select(['id', 'premium', 'blacklist'])
            authordata = userdata.find(yy => yy.id == message.author.id)
        }

        message.data = {
            cmd: message.content.replace(prefix, '').split(' ').shift(),
            args: message.content.replace(prefix, '').split(' ').slice(1).join(' '),
            arg: message.content.replace(prefix, '').split(' ').slice(1),
            authorPerm: utils.Permission.getUserPermission(message.member)
        }

        message.author.data = authordata
        message.guild.data = guilddata

        const cmd = await commands.find(r=> r.alias.includes(message.data.cmd))
        if(!cmd) return
        if(utils.Permission.compare(cmd.permission, message.data.authorPerm)) {
            if(cmd.voiceChannel && !message.member.voice.channel) return message.reply('먼저 음성 채널에 접속해줘!')
            if(cmd.args && cmd.args.length > message.data.arg.length) return message.reply(`누락된 항목이 있습니다!\n\`\`\`사용법: ${client.config.client.prefix}${message.data.cmd} ${cmd.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`)}\`\`\``)

            client.commands = commands
            client.prefix = client.config.client.prefix
            let player = await client.music.playerCollection.get(message.guild.id)
            cmd.execute({ client, message, player }).catch(e=> {
                console.log(e)
                let errcode = uuid.v1()

                client.channels.cache.get(client.config.client.noticechannel).send(new Embed(message).error(message, e, errcode))
                message.reply(`푸시🤒... 봇을 실행하는 도중 오류가 발생했어요. 아래 에러 코드를 개발자한테 전달해주시면 에러 해결에 도움이 될거에요.\n\n에러코드: \`${errcode}\``)
            })
        }
        else return message.reply(`해당 커맨드를 실행하려면 퍼미션 \`${cmd.permission}\`이 필요합니다. | ${message.data.authorPerm} | ${utils.Permission.compare(cmd.permission, message.data.authorPerm)}`)
    })
}