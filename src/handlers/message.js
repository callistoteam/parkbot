const utils = require('../utils')
const uuid = require('uuid')
const Dokdo = require('dokdo')

/*
        this.on('message', async (msg) => {
            if (msg.author.bot || !msg.guild) return
            if (!msg.content.startsWith('$play')) return
            if (this.shoukaku.getPlayer(msg.guild.id)) return
            const args = msg.content.split(' ')
            if (!args[1]) return
            const node = this.shoukaku.getNode()
            let data = await node.rest.resolve(args[1])
            if (!data) return
            const player = await node.joinVoiceChannel({
                guildID: msg.guild.id,
                voiceChannelID: msg.member.voice.channelID
            }) 
            player.on('error', (error) => {
                console.error(error)
                player.disconnect()
            })
            for (const event of ['end', 'closed', 'nodeDisconnect']) player.on(event, () => player.disconnect())
            data = data.tracks.shift()
            await player.playTrack(data) 
            await msg.channel.send('Now Playing: ' + data.info.title)
        }) 
*/

module.exports = async (client, commands) => {
    // eslint-disable-next-line node/no-extraneous-require
    const DokdoHandler = new Dokdo(
        client,
        { 
            aliases: ['dokdo', 'dok'],
            owners: client.config.client.dev, 
            prefix: client.config.client.prefix, 
            noPerm: (message) => message.reply('No Permission')
        }
    )

    client.on('message', async (message) => {
        if(message.author.bot) return
        message.guild.data = await utils.Database.getGuildData(client, message)

        DokdoHandler.run(message)

        if(message.content.includes('파크봇')) await utils.Database.pushChattingData(client, message)

        if(!message.content.startsWith(client.config.client.prefix)) return

        message.author.data = await utils.Database.getUserData(client, message)
        message.member.data = message.author.data

        message.data = {
            cmd: message.content.replace(client.config.client.prefix, '').split(' ').shift(),
            args: message.content.replace(client.config.client.prefix, '').split(' ').slice(1).join(' '),
            arg: message.content.replace(client.config.client.prefix, '').split(' ').slice(1),
            authorPerm: utils.Permission.getUserPermission(message.member)
        }

        const cmd = await commands.find(r=> r.alias.includes(message.data.cmd))
        if(!cmd) return

        if(utils.Permission.compare(cmd.permission, message.data.authorPerm)) {
            if(cmd.voiceChannel && !message.member.voice.channel) return message.reply('먼저 음성 채널에 접속해줘!')
            if(cmd.args && cmd.args.length > message.data.arg.length) return message.reply(`누락된 항목이 있습니다.
\`\`\`사용법: ${client.config.client.prefix}${message.data.cmd} ${cmd.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`).join(" ")}\`\`\`
            `)
            
            client.commands = commands
            client.prefix = client.config.client.prefix
            
            cmd.execute({ client, message }).catch(e=> {
                let errcode = uuid.v1()
                console.error(errcode + '\n' + e)

                // client.channels.cache.get(client.config.client.noticechannel).send(new utils.Embed(message).error(message, e, errcode))
                message.reply(`푸시🤒... 커맨드를 실행하는 도중 오류가 발생했어요.\n\n에러코드: \`${errcode}\``)
            })
        }
        else return message.reply(`해당 커맨드를 실행하려면 퍼미션 \`${cmd.permission}\`이 필요합니다. | 현재 퍼미션: ${message.data.authorPerm}`)
    })
}
