const { Client, Collection } = require('discord.js')
const { Shoukaku } = require('shoukaku')
// eslint-disable-next-line node/no-unpublished-require
const config = require('../../config')
const fs = require('fs')
const utils = require('../utils')
const client = new Client()
const path = require('path')
console.log('[LOAD] Loaded Confing.')

this.config = config
this.knex = require('knex')(this.config.database)
this.commands = new Collection()

utils.loadCommands(this.commands, client, './commands')

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
        this.shoukaku.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`))
        this.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error))
        this.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`))
        this.shoukaku.on('disconnected', (name, reason) => console.warn(`Lavalink ${name}: Disconnected, Reason ${reason || 'No reason'}`))
    }

    _setupClientEvents() {
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

        this.on('ready', () => {
            var client = this

            console.log(`[READY] Logged in to ${client.user.tag}`)

            client.knex = this.knex
            client.config = this.config
        
            client.music = this.shoukaku
            // eslint-disable-next-line
            let y = fs.readdirSync(path.join(__dirname, '../handlers')).filter(el=> el.split('.').pop() === 'js')
        
            y.map(handler => {
                // eslint-disable-next-line
                if(handler.includes("music")) return
                // eslint-disable-next-line security/detect-non-literal-require
                require(`../handlers/${handler}`)(client, this.commands)
            })
            
            setInterval(() => {
                const index = Math.floor(Math.random() * (client.config.client.statusList.length - 1) + 1)
                // eslint-disable-next-line
                client.user.setActivity(client.config.client.statusList[index]) 
            }, 10000)
        })
    }
}

new ParkBot().login(config.client.token).catch(console.error)