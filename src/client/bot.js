const { Client, Collection, MessageEmbed } = require('discord.js')
const { Shoukaku } = require('shoukaku')
// eslint-disable-next-line node/no-unpublished-require
const config = require('../../config')
const fs = require('fs')
const utils = require('../utils')
const path = require('path')
console.log('[LOAD] Loaded Confing.')

const LavalinkServer = config.lavalink.nodes
const ShoukakuOptions = { moveOnDisconnect: false, resumable: false, resumableTimeout: 30, reconnectTries: 2, restTimeout: 10000 }

class ParkBot extends Client {
    constructor(opts) {
        super(opts)
        this.shoukaku = new Shoukaku(this, LavalinkServer, ShoukakuOptions)
    }

    login(token) {
        this._setupShoukakuEvents()
        this._setupClientEvents()
        return super.login(token)
    }

    _setupShoukakuEvents() {
        this.shoukaku.on('ready', (name) => console.log(`[READY] Lavalink ${name}: Ready!`))
        this.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error))
        this.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`))
        this.shoukaku.on('disconnected', (name, reason) => console.warn(`Lavalink ${name}: Disconnected, Reason ${reason || 'No reason'}`))
    }

    _setupClientEvents() {
        this.on('ready', () => {
            var client = this
            const Dokdo = require('dokdo')
            const DokdoHandler = new Dokdo(
                client, 
                { 
                    aliases: ['dokdo', 'dok'], 
                    owners: config.client.dev, 
                    prefix: config.client.prefix, 
                    noPerm: (message) => message.reply('No Permission')
                }
            )

            this.commands = new Collection()
            utils.loadCommands(this.commands, client, './commands')

            console.log(`[READY] Logged in to ${client.user.tag}`)

            client.knex = require('knex')(config.database)
            client.config = config
            client.queue = new utils.Queue(this)
            client.SE = new MessageEmbed
        
            client.music = this.shoukaku
            // eslint-disable-next-line
            let y = fs.readdirSync(path.join(__dirname, '../handlers')).filter(el=> el.split('.').pop() === 'js')
        
            y.map(handler => {
                // eslint-disable-next-line
                if(handler.includes("music")) return
                // eslint-disable-next-line security/detect-non-literal-require
                require(`../handlers/${handler}`)(client, this.commands, DokdoHandler)
            })

            client.processMem = () => {
                let keys = Object.keys(process.memoryUsage())
                let a = process.memoryUsage()
                let result = {}
                
                // eslint-disable-next-line
                keys.map(key => result[key] = (a[key] / 1024 / 1024).toFixed(2) + 'MB')
        
                return result
            }
            
            setInterval(() => {
                const index = Math.floor(Math.random() * (client.config.client.statusList.length - 1) + 1)
                // eslint-disable-next-line
                client.user.setActivity(client.config.client.statusList[index]) 
            }, 10000)
        })
    }
}

new ParkBot().login(config.client.token).catch(console.error)