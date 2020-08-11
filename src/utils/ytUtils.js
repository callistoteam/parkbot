/* eslint-disable */
const { Client } = require("@sirubot/yt-related-scraper")

module.exports = class ytUtils {
    constructor(player) {
        this.init(player)
    }
    init(player){
        this.player = player
    }
    related(url, title, member) {
        return Client.get(url)
            .then(results => {
                return results
            })
            .catch(async (e) => {
                const result = await this.player.lavaSearch(encodeURI(title), member, { source: "yt" })
                if(lavaSearch.length === 0) return undefined
                return Client.get(result[0].uri).then(r=> r).catch(e=> undefined)
            })
    }
}