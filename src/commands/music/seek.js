const { Command } = require('../../utils')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

module.exports = class Seek extends Command {
    constructor(client){
        super(client)
        this.alias = [ '탐색', 'seek' ]
        this.permission = 0x0
        this.args = [ { name: '탐색할 초', required: true } ]
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')
        
        let second = parseInt(message.data.arg[0])
        if(message.data.arg[0] < 0) return message.reply('탐색할 초는 0보다 커야해.')

        try{
            await player.seek(second * 1000)
        } catch(e) {
            if(e.includes('The provided position must be in between')) return message.reply('탐색할 초는 음악의 최대 길이보다 짧아야해.')
            throw e
        }
        

        let rs = moment.duration(player.position).format('HH시간 mm분 ss초')
        message.channel.send(`\`${rs}\`로 건너뛰었어!`)
    }
}