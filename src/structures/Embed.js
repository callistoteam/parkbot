const { MessageEmbed } = require('discord.js')
module.exports = class Embed {
    /**
     * Fucking embed Builder
     * @param {Message} message
     */
    constructor (message) {
        this.setup(message)
    }

    setup(message){
        this.embed = new MessageEmbed()
        if(!message) return this.embed
        this.embed.setFooter(message.author.tag, message.author.avatarURL())
        this.embed.setTimestamp(new Date())
    }

    trackPlay (title, length, url, thumbnail, user) {
        return this.embed.setAuthor('음악 재생')
            .setTitle(`${title}`)
            .setDescription(
                `신청자: ${user} | 길이: ${this._formatTime(length)}`
            )
            .setURL(url)
            .setImage(thumbnail.medium)
            .setColor('RANDOM')
    }

    lyrics(result){
        return this.embed.setTitle(result.title).addField('가사', result.result.substr(0, 1000) + '`...1000자 이상`')
    }
    
    viewQueue(queue) {
        let data = ''
        for(let k of queue) {
            let g = k[0]
            k = k[1]
            if(g !== 1) data += `[#${g-1}] [${k.title}](${k.uri}) - ${this._formatTime(k.length)} by ${k.user}\n`
            else console.log(k)
        }
        try{
            return this.embed.setAuthor('대기열')
                .setDescription(`현재 재생중: ${queue.get(1).title} - ${queue.get(1).user}\n\n${data}`)
        // eslint-disable-next-line
        } catch{
            return this.embed.setAuthor('대기열')
                .setDescription(`${data}`)
        } 
    }

    queueEnd() {
        return this.embed.setAuthor('대기열 종료')
            .setTitle('신청한 모든 음악을 재생했습니다.')
            .setDescription('그럼 난 이만 :wave:')
    }

    nowPlay(music) {
        return this.embed.setDescription(`현재 재생 중: [${music.title}](${music.uri})\n음악 출처: ${music.author}`).setImage(music.thumbnail.medium)
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
        // eslint-disable-next-line no-unused-vars
        for (const [ k, v ] of Object.entries(time)) {
            let first = false
            if (v < 1 && !first) continue
    
            res.push(v < 10 ? `0${v}` : `${v}`)
            first = true
        }
        return res.join(':')
    }
}