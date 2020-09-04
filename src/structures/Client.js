const { Client, Collection } = require('discord.js')
const { LavaClient } = require('@anonymousg/lavajs')
const uuid = require('uuid')
const utils = require('../utils')
const Embed = require('./Embed')

const fs = require('fs')
const path = require('path')

const cooldown = new Set()
// eslint-disable-next-line
const knex = require('knex')(require('../../database'))
const client = new Client()

module.exports = class ParkBotClient {
    constructor( config ) {
        if(!config) throw '"config" is not given.'
        else {
            this.config = config
            console.log(`[LOAD] Loaded Confing. Starting with ${config.mode || 'production'} mode.`)
        }
        this.initialized = false
        this.lavalink = config.lavalink.node
        this.commands = new Collection()
    }

    init() {
        if(this.initialized) throw 'Already initialized. Can\'t reinitialize.'
        else this.initialized = true
        this.loadCommands('./commands')
        client.login(this.config.client.token)
        
        client.on('guildCreate', guild => {
            client.channels.cache.get(this.config.client.noticechannel).send(`new guild\nName:\`${guild.name}\`(${guild.id})\nOwner:${guild.owner}(@${guild.owner.id})`)
        })

        client.on('guildDelete', guild => {
            client.channels.cache.get(this.config.client.noticechannel).send(`left guild\nName:\`${guild.name}\`(${guild.id})\nOwner:${guild.owner}(@${guild.owner.id})`)
        })
        
        setInterval(() => {
            const interstatus = Math.floor(Math.random() * (this.config.client.statusList.length - 1) + 1)
            // eslint-disable-next-line security/detect-object-injection
            client.user.setActivity(this.config.client.statusList[interstatus])
        }, 15000)

        client.on('ready', () => {
            console.log(`[READY] Logged in to ${client.user.tag}`)

            client.knex = knex

            client.premiumMusic = new LavaClient(client, this.config.lavalink.premiumnodes)
            client.premiumMusic.on('nodeSuccess', (node) => {
                console.log(`[INFO | Premium] Node connected: ${node.options.host}`)
            })
            client.premiumMusic.on('nodeError', console.error)
            client.premiumMusic.on('trackPlay', (track, player) => {
                const { title, length, uri, thumbnail, user } = track
                return player.options.textChannel.send(new Embed().trackPlay(title, length, uri, thumbnail, user))
            })
            client.premiumMusic.on('queueOver', async(player) => {
                player.destroy()
                player.options.textChannel.send(
                    new Embed().queueEnd()
                )
            })
            
            client.music = new LavaClient(client, this.config.lavalink.nodes)
            client.music.on('nodeSuccess', (node) => {
                console.log(`[INFO] Node connected: ${node.options.host}`)
            })
            client.music.on('nodeError', console.error)
            client.music.on('trackPlay', (track, player) => {
                const { title, length, uri, thumbnail, user } = track
                try{
                    if(user.presence.clientStatus.mobile) return player.options.textChannel.send(`<a:playforpark:708621715571474482> \`${title}\`을(를) 재생할게!`)
                // eslint-disable-next-line node/no-unsupported-features/es-syntax
                } catch {
                    return player.options.textChannel.send(new Embed().trackPlay(title, length, uri, thumbnail, user))
                }
                player.options.textChannel.send(
                    new Embed().trackPlay(title, length, uri, thumbnail, user)
                )
            })
            client.music.on('trackOver', (track) => {
                console.log(track)
            })
            client.music.on('queueOver', async(player) => {
                player.destroy()
                player.options.textChannel.send(
                    new Embed().queueEnd()
                )
                /* if(player.noRelated) {
                     player.destroy()
                     player.options.textChannel.send(
                         new Embed().queueEnd()
                     )
                 } else {
                     console.log(await new utils.ytUtils(player).related(player.previous.uri, player.previous.title, player.options.guild.me))
                }*/
            })
        })
        
        client.on('message', async (message) => {
            if(message.author.id == '667618259847086110'){
                message.channel.send('✅')
            }
            if(message.author.bot || !message.content.startsWith(this.config.client.prefix)) return
            let userdata = await client.knex('users').select(['id', 'premium', 'blacklist'])
            let authordata = userdata.find(yy => yy.id == message.author.id)

            try{
                if(authordata.blacklist == 1) message.reply('블랙리스트된 유저.')
            } catch {
                await client.knex('users').insert({id: message.author.id, premium: '1601827684505', blacklist: '0'})
                userdata = await client.knex('users').select(['id', 'premium', 'blacklist'])
                authordata = userdata.find(yy => yy.id == message.author.id)
            }
            
            if(cooldown.has(message.author.id)) return message.reply('쿨타임(2초)을 기다려줘')

            message.data = {
                cmd: message.content.replace(this.config.client.prefix, '').split(' ').shift(),
                args: message.content.replace(this.config.client.prefix, '').split(' ').slice(1).join(' '),
                arg: message.content.replace(this.config.client.prefix, '').split(' ').slice(1),
                authorPerm: utils.Permission.getUserPermission(message.member)
            }

            message.author.data = authordata

            const cmd = this.commands.find(r=> r.alias.includes(message.data.cmd))
            if(!cmd) return
            if(utils.Permission.compare(cmd.permission, message.data.authorPerm)) {
                if(cmd.voiceChannel && !message.member.voice.channel) return message.reply('먼저 음성 채널에 접속해줘!')
                if(cmd.args && cmd.args.length > message.data.arg.length) return message.reply(`누락된 항목이 있습니다!\n\`\`\`사용법: ${this.config.client.prefix}${message.data.cmd} ${cmd.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`)}\`\`\``)

                client.commands = this.commands
                client.prefix = this.config.client.prefix
                let player

                if(message.author.data.premium > new Date){
                    player = await client.premiumMusic.playerCollection.get(message.guild.id)
                } else{
                    player = await client.music.playerCollection.get(message.guild.id)
                }
                cmd.execute({ client, message, player }).catch(e=> {
                    let errcode = uuid.v1()
                    client.channels.cache.get(this.config.client.noticechannel).send(new Embed(message).error(message, e, errcode))
                    message.reply(`푸시🤒... 봇을 실행하는 도중 오류가 발생했어요. 아래 에러 코드를 개발자한테 전달해주시면 에러 해결에 도움이 될거에요.\n\n에러코드: \`${errcode}\``)
                })

                cooldown.add(message.author.id)
                setTimeout(() => {
                    cooldown.delete(message.author.id)
                }, 2000)
            }
            else return message.reply(`해당 커맨드를 실행하려면 퍼미션 \`${cmd.permission}\`이 필요합니다. | ${message.data.authorPerm} | ${utils.Permission.compare(cmd.permission, message.data.authorPerm)}`)
        })
    }

    loadCommands(dir) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const categories = fs.readdirSync(path.join(__dirname, '../', dir)).filter(el=> fs.lstatSync(path.join(__dirname, '../', dir, el)).isDirectory())
        categories.forEach(category => {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            const commands = fs.readdirSync(path.join(__dirname, '../', dir, category)).filter(el=> !fs.lstatSync(path.join(__dirname, '../', dir, category, el)).isDirectory() && el.split('.').pop() === 'js')
            commands.forEach(command => {
                // eslint-disable-next-line security/detect-non-literal-require
                let cmd = require(path.join(__dirname, '../', dir, category, command))
                cmd.category = category
                this.commands.set(command.split('.').shift(), new cmd(client))
            })
        })

        console.log(`[LOAD] Loaded ${this.commands.size} commands`)
    }
}