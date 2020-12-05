const { Command } = require('../../utils')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

var getMoney = async (now, message, client, msg, money) => {
    let pointTime = now.setHours(now.getHours() + 1)
    let newPoint = parseInt(message.author.data.point) + parseInt(money)

    let pl = JSON.parse(message.author.data.pointlog).log
    pl.push(`+${money}포인트: 포인트받기에 의한 포인트 추가`)

    await client.knex('users').update({ point: newPoint.toString(), pointlog: `{"log": ${JSON.stringify(pl)}}`, pointtime: pointTime }).where({ id: message.author.id })

    message.channel.send(msg)
}

module.exports = class GetPoint extends Command {
    constructor(client){
        super(client)
        this.alias = [ '돈받기', '포인트받기', 'gp', 'getpoint', 'payday' ]
        this.permission = 0x0
        this.category = 'point'
    }

    async execute({ client, message }){
        let now = new Date()

        if(message.author.data.pointtime > now){
            let wt = moment.duration(message.author.data.pointtime - now).format('HH시간 mm분 ss초')
            return message.reply(`${wt} 뒤에 해당 커맨드를 사용할 수 있어.`)
        }

        if(parseInt(now.getDay()) > 14 && parseInt(now.getDay()) < 32 && parseInt(now.getMonth() + 1) == 12){ // 일이 14보다 크고 32보다 작고 12월이라면
            return await getMoney(
                now, 
                message, 
                client, 
                '> 🎄 **Merry Christmas**! 원래 보상의 3배(150포인트)를 지급했어. `#지갑` 커맨드로 잔고를 확인해봐.\n해당 이벤트는 12월 31일까지 유효해.', 
                150
            )
        }

        await getMoney(
            now, 
            message, 
            client, 
            '> 50포인트가 추가되었어. `#지갑`커맨드로 잔고를 확인해봐!', 
            50
        )
    }
}