const { Client, Collection } = require('discord.js')
const { LavaClient } = require("@anonymousg/lavajs");

const utils = require("../utils")
const Embed = require('./Embed')

const fs = require('fs')
const path = require('path')

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
        client.on('ready', () => {
            console.log(`[READY] Logged in to ${client.user.tag}`)
            client.music = new LavaClient(client, this.config.lavalink.nodes)
            client.music.on('nodeSuccess', (node) => {
                console.log(`[INFO] Node connected: ${node.options.host}`)
            }
            )
            client.music.on('nodeError', console.error)
            client.music.on('trackPlay', (track, player) => {
                const { title, length, uri, thumbnail, user } = track
                player.options.textChannel.send(
                    new Embed().trackPlay(title, length, uri, thumbnail, user)
                )
            })
            client.music.on('trackOver', (track, player) => {
                console.log(player.queue.size)
            })
            client.music.on('queueOver', async(player) => {
                // if(player.noRelated) {
                //     player.destroy()
                //     player.options.textChannel.send(
                //         new Embed().queueEnd()
                //     )
                // } else {
                //     console.log(await new utils.ytUtils(player).related(player.previous.uri, player.previous.title, player.options.guild.me))
                // }
            })
        })
        
        client.on('message', (message) => {
            if(message.author.bot || !message.content.startsWith(this.config.client.prefix)) return

            message.data = {
                cmd: message.content.replace(this.config.client.prefix, '').split(' ').shift(),
                args: message.content.replace(this.config.client.prefix, '').split(' ').slice(1).join(' '),
                arg: message.content.replace(this.config.client.prefix, '').split(' ').slice(1),
                authorPerm: utils.Permission.getUserPermission(message.member)
            }

            const cmd = this.commands.find(r=> r.alias.includes(message.data.cmd))
            if(!cmd) return
            if(utils.Permission.compare(cmd.permission, message.data.authorPerm)) {
                if(cmd.voiceChannel && !message.member.voice.channel) return message.reply('먼저 음성 채널에 접속해줘!')
                if(cmd.args && cmd.args.length > message.data.arg.length) return message.reply(`누락된 항목이 있습니다!\n\`\`\`사용법: ${this.config.client.prefix}${message.data.cmd} ${cmd.args.map(el=> el.required ? `[${el.name}]` : `(${el.name})`)}\`\`\``)
                cmd.execute({ client, message })
                .catch(e=> {console.error(e); message.reply('푸시🤒... 봇을 실행하는 도중 오류가 발생했어요.')})
            }
            else return message.reply(`퍼미션이 부족합니다. ${cmd.permission} | ${message.data.authorPerm} | ${utils.Permission.compare(cmd.permission, message.data.authorPerm)}`)
        })
    }

    loadCommands(dir) {
        const categories = fs.readdirSync(path.join(__dirname, '../', dir)).filter(el=> fs.lstatSync(path.join(__dirname, '../', dir, el)).isDirectory())
        categories.forEach(category => {
            const commands = fs.readdirSync(path.join(__dirname, '../', dir, category)).filter(el=> !fs.lstatSync(path.join(__dirname, '../', dir, category, el)).isDirectory() && el.split('.').pop() === 'js')
            commands.forEach(command => {
                let cmd = require(path.join(__dirname, '../', dir, category, command))
                cmd.category = category
                this.commands.set(command.split('.').shift(), new cmd(client))
            })
        })

        console.log(`[LOAD] Loaded ${this.commands.size} commands`)
    }
}