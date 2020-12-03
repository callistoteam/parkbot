const { Command } = require('../../utils')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

module.exports = class GetPoint extends Command {
    constructor(client){
        super(client)
        this.alias = [ '돈받기', '포인트받기', 'gp', 'getpoint' ]
        this.permission = 0x0
        this.category = 'point'
    }

    async execute({ client, message }){
        if(message.author.data.pointtime > new Date()){
            let wt = moment.duration(message.author.data.pointtime - new Date()).format('HH시간 mm분 ss초')
            return message.reply(`${wt} 뒤에 해당 커맨드를 사용할 수 있어.`)
        }

        let pointTime = new Date().setHours(new Date().getHours() + 1)
        let newPoint = parseInt(message.author.data.point) + 50

        let pl = JSON.parse(message.author.data.pointlog).log
        pl.push('+50포인트: 포인트받기에 의한 포인트 추가')

        await client.knex('users').update({ point: newPoint.toString(), pointlog: `{"log": ${JSON.stringify(pl)}}`, pointtime: pointTime }).where({ id: message.author.id })

        message.channel.send('> 50포인트가 추가되었어. `#지갑`커맨드로 잔고를 확인해봐!')
    }
}