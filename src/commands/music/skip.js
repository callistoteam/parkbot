const Command = require("../../structures/Command");

module.exports = class Skip extends Command {
    alias = [ "s", '스킵' ]
    permission = 0

    async execute({ client, message }){
        // gdgd
    }
}