const Command = require("../../structures/Command");

module.exports = class Ping extends Command {
    alias = [ "ping", "핑" ]
    permission = 0

    async execute({ client, message }){
        message.channel.send(client.ws.ping)
    }
}