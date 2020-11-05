const { Command } = require('../../utils')

module.exports = class Premium extends Command {
    constructor(client){
        super(client)
        this.alias = [ '구매', 'buy' ]
        this.permission = 0x0
        this.args = [ { name: '일수', required: true } ]
        this.category = 'point'
    }

    async execute({ message }){
        if(message.data.args.includes('일')){
            let sday = ['3', '7', '14', '90']
            let day = message.data.args.replace('일', '')
            if(!sday.includes(day)){
                return message.reply(`결제할 수 있는 일 수는 ${sday.join('일, ',' ')}이야.\n\n예시:\`\`\`#구매 3일\`\`\``)
            }
        }
    }
}