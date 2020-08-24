const Command = require('../../structures/Command')

module.exports = class Error extends Command {
    constructor(client) {
        super(client)
        this.alias = [ 'error' ]
        this.permission = 0x8
        this.category = 'dev'
    }

    async execute(){
        throw new Error
    }
}