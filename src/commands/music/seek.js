const Command = require('../../structures/Command')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

module.exports = class Seek extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'seek' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        if(!message.data.arg[0]) return message.reply('건너뛸 초를 입력해줘.')
        let second = parseInt(message.data.arg[0])
        if(message.data.arg[0] < 0) return message.reply('건너뛸 초는 0보다 커야해.')
        if(message.data.arg[0] > 262000) return message.reply('건너뛸 초는 262보다 작아야해.')

        await player.seek(second * 1000)

        let rs = moment.duration(player.position).format('HH시간 mm분 ss초')
        message.channel.send(`\`${rs}\`로 건너뛰었어!`)
    }
}