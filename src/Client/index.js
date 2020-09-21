const { Client, Collection } = require('discord.js')
const fs = require('fs')

const utils = require('../utils')

const client = new Client()
const path = require('path')

module.exports = class ParkBotClient {
    constructor( config ) {
        if(!config) throw '[ERR] "config" is not given'
        else {
            this.config = config
            console.log('[LOAD] Loaded Confing.')
            this.knex = require('knex')(this.config.database)
        }
        this.initialized = false
        this.commands = new Collection()
    }

    async init() {
        if(this.initialized) throw 'Aleady initiallized.'
        else this.initialized = true
        utils.loadCommands(this.commands, client, './commands')
        await client.login(this.config.client.token)
        client.on('ready', () => {
            console.log(`[READY] Logged in to ${client.user.tag}`)
            client.knex = this.knex
            client.config = this.config
    
            // eslint-disable-next-line
            let y = fs.readdirSync(path.join(__dirname, '../handlers')).filter(el=> el.split('.').pop() === 'js')
    
            y.map(handler => {
                // eslint-disable-next-line
                require(`../handlers/${handler}`)(client, client.knex, this.commands, this.config.lavalink.nodes)
            })
        })
    }
}