const { Command } = require('../../utils')

var genRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}


module.exports = class A extends Command {
    constructor(client){
        super(client)
        this.alias = [ '올인', 'a' ]
        this.permission = 0x0
        this.category = 'point'
    }

    async execute({ client, message }){
        let msg = await message.channel.send(`<@${message.author.id}>, 올인을 시작합니다. 돈을 모두 잃거나 \`2\`배로 돈이 늘어나거나! 확률은 50%`)
        let lucky = genRandomInt(0, 2) == 1

        if(lucky){
            await client.knex('users').update({ point: message.author.data.point*2 }).where({id: message.author.id})
            return msg.edit(`
🎊 축하해요! 올인에 성공해서 돈이 2배로 늘어났어요.
현재 잔고: ${message.author.data.point * 2}

**도박 중독, 불행의 시작입니다.**
            `)
        } else {
            await client.knex('users').update({ point: 0 }).where({id: message.author.id})
            return msg.edit(`
🎊 박이 고꾸라져서 돈이 다 시공속으로 사라졌어요!
현재 잔고: 0

${parseInt(message.author.data.point) > 129 ? '스토어에서 포인트를 구매하신적이 있으신가요? premium@parkbot.ml 로 연락하시면 잃은 돈을 돌려드려요.' : '**도박 중독, 불행의 시작입니다.**'}
            `)
        }
    }
}