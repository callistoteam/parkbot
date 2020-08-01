const { Client, Collection } = require('discord.js')
const { LavaClient } = require("@anonymousg/lavajs");

const utils = require("../utils")
const { Embed } = require('../structures')

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
                    new Embed(message).trackPlay(title, length, uri, thumbnail, user)
                )
            })
        })
        client.on('message', (message) => {
            if(message.author.bot || !message.content.startsWith(this.config.client.prefix)) return

            message.data = {
                cmd: message.content.replace(this.config.client.prefix, '').split(' ').shift(),
                content: message.content.slice(message.content.split(' ')[0].length + 1),
                authorPerm: utils.Permission.getUserPermission(message.member)
            }

            const cmd = this.commands.find(r=> r.alias.includes(message.data.cmd))
            if(!cmd) return
            if(utils.Permission.compare(cmd.permission, message.data.authorPerm)) cmd.execute({ client, message })
            else return message.reply(`퍼미션 ㅅㄱ${cmd.permission} | ${message.data.authorPerm} | ${utils.Permission.compare(cmd.permission, message.data.authorPerm)}`)
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