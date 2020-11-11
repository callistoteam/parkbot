const { Command } = require('../../utils')

module.exports = class Byt extends Command {
    constructor(client){
        super(client)
        this.alias = [ '구매', 'buy' ]
        this.permission = 0x0
        this.args = [ { name: '일수', required: true } ]
        this.category = 'point'
    }

    async execute({ message }){
        let sday = ['3', '7', '14', '31', '90']
        let day = message.data.args.replace('일', '')
        if(!sday.includes(day)) return message.reply(`결제할 수 있는 일 수는 ${sday.join('일, ',' ')}일이야.\n\n예시:\`\`\`#구매 3일\`\`\``)

        let jd = { '3': '70', '7': '130', '14': '250', '31': '500', '90': '1000' }
        // eslint-disable-next-line security/detect-object-injection
        let pr = jd[day]
        message.reply(pr)
    }
}