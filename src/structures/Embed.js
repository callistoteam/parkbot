const { MessageEmbed, Message } = require('discord.js')
module.exports = class Embed {
    /**
     * Fucking embed Builder
     * @param {Message} message 
     */
    constructor (message) {
        this.embed = new MessageEmbed()
        if(!message) return this.embed
        this.embed.setFooter(message.author.tag, message.author.avatarURL())
        this.embed.setTimestamp(new Date())
        return this.embed
    }
    trackPlay (title, length, uri, thumbnail, user) {
        return this.embed
        .setAuthor('음악 재생')
        .setTitle(`${title}`)
        .setDescription(
            `신청자: ${user}. 길이: ${this._formatTime(length)}`
        )
        .setURL(url)
        .setImage(thumbnail.medium)
        .setColor('RANDOM')
    }

    _formatTime(ms) {
        const time = {
            d: 0,
            h: 0,
            m: 0,
            s: 0
        }
        time.s = Math.floor(ms / 1000)
        time.m = Math.floor(time.s / 60)
        time.s = time.s % 60
        time.h = Math.floor(time.m / 60)
        time.m = time.m % 60
        time.d = Math.floor(time.h / 24)
        time.h = time.h % 24
    
        const res = []
        for (const [ k, v ] of Object.entries(time)) {
            let first = false
            if (v < 1 && !first) continue
    
            res.push(v < 10 ? `0${v}` : `${v}`)
            first = true
        }
        return res.join(':')
    }
}