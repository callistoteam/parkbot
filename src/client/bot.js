const { Client, Collection } = require('discord.js')
// eslint-disable-next-line
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
client.login(this.config.client.token)
client.on('ready', () => {
    console.log(`[READY] Logged in to ${client.user.tag}`)
    client.knex = this.knex
    client.config = this.config

    // eslint-disable-next-line
    let y = fs.readdirSync(path.join(__dirname, '../handlers')).filter(el=> el.split('.').pop() === 'js')

    y.map(handler => {
        // eslint-disable-next-line
        require(`../handlers/${handler}`)(client, this.commands)
    })
    
    setInterval(() => {
        const index = Math.floor(Math.random() * (client.config.client.statusList.length - 1) + 1)
        // eslint-disable-next-line
        client.user.setActivity(client.config.client.statusList[index]) 
    }, 10000)
})