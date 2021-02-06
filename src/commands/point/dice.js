const { Command, Embed } = require('../../utils')

module.exports = class Dice extends Command {
    constructor(client){
        super(client)
        this.alias = [ '주사위', 'dice', 'ㅈㅅㅇ' ]
        this.permission = 0x0
        this.args = [ { name: '주사위숫자', required: true }, { name: '걸 돈', required: true } ]
        this.category = 'point'
    }

    async execute({ client, message }){
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        if(parseInt(message.author.data.point.toString()) < message.data.arg[1]) return message.reply('잔고가 부족합니다. 걸 돈을 줄이거나 \`#돈받기\`로 포인트를 더 모은 후 사용해주세요.')

        var ls = ['1', '2', '3', '4', '5', '6']
        
        if(!ls.includes(message.data.arg[0])) return message.reply('숫자는 1이상 6이하 정수여야합니다.')
        let pl = JSON.parse(message.author.data.pointlog).log

        var aa = getRandomInt(1, 7)
        if(aa == message.data.arg[0]) {
            var tx = parseInt(message.data.arg[1]) * 2
            pl.push(`+${tx}포인트: 주사위 성공에 의한 포인트 추가`)
            message.reply(`주사위의 숫자를 맞춰서 건 포인트(\`${message.data.arg[1]}\`)의 2배를 얻었어.`)
            await client.knex('users').update({ point: (parseInt(message.author.data.point.toString()) + tx).toString(), pointlog: `{"log": ${JSON.stringify(pl)}}` }).where({ id: message.author.id })
        } else {
            pl.push(`-${message.data.arg[1]}포인트: 주사위 실패에 의한 포인트 삭감`)
            message.reply(`아쉽게도 주사위의 숫자를 맞추지 못해서 건 포인트(\`${message.data.arg[1]}\`)를 모두 잃었어. 주사위의 숫자: \`${aa}\``)
            await client.knex('users').update({ point: (parseInt(message.author.data.point.toString()) - parseInt(message.data.arg[1])).toString(), pointlog: `{"log": ${JSON.stringify(pl)}}` }).where({ id: message.author.id })
        }
    }
}