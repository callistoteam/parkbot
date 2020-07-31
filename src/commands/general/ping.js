const Command = require("../../structures/Command");

module.exports = class Ping extends Command {
    static alias = [ "ping", "핑" ]
    static permission = 0
    execute({ client, message }){
        message.channel.send('GG')
    }
}