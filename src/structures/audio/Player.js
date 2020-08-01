const { Player } = require('@anonymousg/lavajs')

module.exports = class ServerPlayer extends Player {
    constructor(lavalink, g, gg){
        console.log(g)

        super(lavalink)
        this.player = lavalink.spawnPlayer(g, gg)
        return this.player
    }

}