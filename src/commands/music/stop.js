const Command = require("../../structures/Command");

module.exports = class Stop extends Command {
    alias = [ "st", 'ㄴ새ㅔ' ]
    permission = 0x0

    async execute({ client, message }){
        // gdgd
    }
}