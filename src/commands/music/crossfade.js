const { Command } = require('../../utils')
const { promisify } = require('util')
const sleep = promisify(setTimeout)

module.exports = class Crossfade extends Command {
    constructor(client){
        super(client)
        this.alias = [ '크로스페이드', 'crossfade' ]
        this.permission = 0x1
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) message.reply('이 서버에서 재생중인 음악이 없어!')
        await sleep(5000)
        message.channel.send('asdfff')
    }
}