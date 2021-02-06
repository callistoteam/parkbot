const { Command, Embed } = require('../../utils')

module.exports = class Dice extends Command {
    constructor(client){
        super(client)
        this.alias = [ '동전', 'coin', 'ㄷㅈ' ]
        this.permission = 0x0
        this.args = [ { name: '앞 또는 뒤', required: true } ]
        this.category = 'point'
    }

    async execute({ client, message }){
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        var ls = ['앞', '뒤']
        if(!ls.includes(message.data.arg[0])) return message.reply('앞 또는 뒤를 선택해주세요.(예 - `#동전 앞`)')
        let pl = JSON.parse(message.author.data.pointlog).log

        if(message.data.arg[0] == '앞') message.data.arg[0] = 1
        if(message.data.arg[0] == '뒤') message.data.arg[0] = 0

        var aa = getRandomInt(0, 2)
        var lucky = aa == message.data.arg[0]
        let msg = await message.channel.send(`<@${message.author.id}>, 동전을 뒤집고 있어요..`)

        if(lucky){
            await client.knex('users').update({ point: message.author.data.point * 2 }).where({ id: message.author.id })
            pl.push(`+${message.author.data.point}포인트: 동전 성공에 의한 포인트 추가`)
            msg.edit(`
🎊 축하해요! 동전의 면을 맞춰서 돈이 2배로 늘어났어요.
현재 잔고: ${message.author.data.point * 2}

**도박 중독, 불행의 시작입니다.**
            `)
        } else {
            await client.knex('users').update({ point: 0 }).where({id: message.author.id})
            pl.push(`-${message.author.data.point}포인트: 동전 실패에 의한 포인트 삭감`)
            msg.edit(`
🎊 동전이 선택한거와 다른 면이 나와서 돈이 없어졌어요.
현재 잔고: 0

**경고: **
            `)
        }
        await client.knex('users').update({pointlog: `{"log": ${JSON.stringify(pl)}}`}).where({id: message.author.id})
    }
}