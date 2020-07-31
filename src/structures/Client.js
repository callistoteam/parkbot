const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const path = require('path')

module.exports = class Client {
    constructor( config ) {
        if(!config) throw '"config" is not given.'
        else {
            this.config = config
            console.log(`[LOAD] Loaded Confing. Starting with ${config.mode || 'production'} mode.`)
        }
        this.initialized = false
        this.commands = new Discord.Collection()
    }

    init() {
        if(this.initialized) throw 'Already initialized. Can\'t reinitialize.'
        else this.initialized = true
        this.loadCommands('./commands')
        client.login(this.config.client.token)
        client.on('ready', () => {
            console.log(`[READY] Logged in to ${client.user.tag}`)
        })
        client.on('message', (message) => {
            if(message.author.bot || !message.content.startsWith(this.config.client.prefix)) return
            message.data = {
                cmd: message.content.replace(this.config.client.prefix, '').split(' ').shift(),
                content: message.content.slice(message.content.split(' ')[0].length + 1)
            }

            const cmd = this.commands.find(r=> r.alias.includes(message.data.cmd))
            if(cmd) cmd.execute({ client, message })

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