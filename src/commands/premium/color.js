const { Command, Embed } = require('../../utils')

module.exports = class Premium extends Command {
    constructor(client){
        super(client)
        this.alias = [ '컬러', 'color' ]
        this.permission = 0x3
        this.category = 'premium'
    }

    async execute({ message }){
        
    }
}