const Command = require('../../structures/Command')
// eslint-disable-next-line security/detect-child-process
const child = require('child_process')

module.exports = class Exec extends Command {
    constructor(client) {
        super(client)
        this.alias = [ 'exec' ]
        this.permission = 0x8
        this.category = 'dev'
    }

    async execute({ message }){
        try{
            const a = child.execSync(message.data.args)
            message.channel.send(`\`\`\`${a}\`\`\``)
        } catch(e){
            message.channel.send(`\`\`\`${e}\`\`\``)
        }
    }
}