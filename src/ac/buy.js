const { Command } = require('../utils')

module.exports = class Buy extends Command {
    constructor(client){
        super(client)
        this.alias = [ '구매', 'buy' ]
        this.permission = 0x0
        this.args = [ { name: '일수', required: true } ]
        this.category = 'point'
    }

    async execute({ client, message }){
        let sday = ['3', '7', '14', '31', '90']
        let day = message.data.args.replace('일', '')
        if(!sday.includes(day)) return message.reply(`결제할 수 있는 일 수는 ${sday.join('일, ',' ')}일이야.\n\n예시:\`\`\`#구매 3일\`\`\``)

        let jd = { '3': '70', '7': '130', '14': '250', '31': '500', '90': '1000' }
        // eslint-disable-next-line security/detect-object-injection
        let pr = jd[day]

        if(pr > message.author.data.point) {
            return message.reply(`${day}일 프리미엄을 사려면 ${pr - message.author.data.point}포인트를 더 모아야해.`)
        }

        let prdate = new Date().setDate(new Date().getDate() + parseInt(day))

        await client.knex('users').update({ point: message.author.data.point - pr, premium: prdate }).where({ id: message.author.id })
        message.reply(`${pr}포인트를 지불해서 ${day}일 프리미엄을 구매했어. 현재 잔고는 ${message.author.data.point - pr}이야.
        
        > 환불: <https://discord.gg/jE33mfD>, #문의 채널
        > 구매한지 7일이 지난 경우 환불 불가(3일은 1일, 7일은 3일)
        > <https://parkbot.ml/docs/sla> 참고.`)
    }
}