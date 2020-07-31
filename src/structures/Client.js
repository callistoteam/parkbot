const Discord = require('discord.js')
const client = Discord.Client()
const fs = require('fs')
const path = require('path')

module.exports = class Client {
    constructor( options ) {
        if(!options.token) throw '"token" is not provided.'

        this.initialized = false
        this.commands = new Discord.Collection()
    }

    init() {

    }

    loadCommands(dir) {
        const categories = fs.readdirSync(path.join(__dirname, dir)).filter(el=> fs.lstatSync(path.join(__dirname, dir, el)).isDirectory())
        categories.forEach(category => {
            this.commands.set()
        })
    }
}