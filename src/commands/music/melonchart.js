const Command = require('../../structures/Command')
const { Embed } = require('../../structures')

module.exports = class Melonchart extends Command {
    constructor(client){
        super(client)
        this.alias = [ '멜론차트', 'melonchart' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message }){
        let embed = await new Embed(message).melonchart()
        message.reply('차트를 불러오고있어').then(msg => {
            msg.edit('', embed)
        })
    }
}