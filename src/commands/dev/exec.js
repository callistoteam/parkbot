const Command = require("../../structures/Command")

module.exports = class Exec extends Command {
    alias = [ "exec" ]
    permission = 0x8

    async execute({ client, message }){
        try{
            const a = child.execSync(message.data.content)
            message.channel.send(`\`\`\`${a}\`\`\``)
        } catch(e){
            message.channel.send(`\`\`\`${e}\`\`\``)
        }
    }
}