const { MessageEmbed } = require('discord.js')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

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

    nowPlay(music, server) {
        return this.embed.setDescription(`[${music.title}](${music.uri})\n> 음악 재생 서버: \`${server}\`서버`).setThumbnail(music.thumbnail.max).setFooter(`음악 출처: ${music.author}`).setColor('RANDOM')
    }

    profile(user) {
        var now = new Date(parseInt(user.premium))
        var year = now.getFullYear()
        var hour = now.getHours()

        let month = now.getMonth() + 1 + '월'
        let day = now.getDate() + '일'
        let daytime = hour >= 12 ? '오후' : '오전'
        let time = hour%12+'시' + now.getMinutes() + '분'
        let dow = ['일','월','화','수','목','금','토','일'][now.getDay()]+'요일'

        let rt = `${year}년 ${month}${day} ${dow} ${daytime} ${time}`

        return this.embed.setTitle('프로필')
            .addField('프리미엄여부', user.premium > new Date ? '참' : '거짓')
            .addField('프리미엄 만료일', rt)
    }

    premium() {
        let desc = `
        파크봇은 일부 유료화로,  기존 서비스는 동일하게 이용할 수 있지만 정액제/1회성 회원권(이하 '프리미엄')으로 질 높은 음악을 제공합니다.
        **혜택**
        ▶️ **향상된 음악 품질**
        많은 유저들이 이용하는 서버와 프리미엄을 소유하고 있는 유저들을 위한 음악 서버는 분리되어 있어 쾌적한 서버에서 음악을 즐기실 수 있습니다.

        ⚡ **업데이트 스포일러**
        업데이트 예정 기능들을 빠르게 아실 수 있습니다.

        📱 **4/7 서포트**
        기존 3/5 서포트와 달리 프리미엄을 소유하고 있는 유저들만을 위한 전용 이메일로 문의를 하실 수 있습니다.

        [프리미엄 구매하기](https://premium.parkbot.ml)
        `
        return this.embed.setTitle('파크봇 프리미엄').setDescription(desc)
    }

    error(message, err, errorcode){
        return this.embed.setTitle('에러').setDescription(`**UUID**: ${errorcode}\n\nAuthor: \`${message.author.id}\`\nGuild: \`${message.guild}\`\nChannel: \`${message.channel}\`\nMessage Content: \`${message.content}\`\n\n**Error**:\`\`\`${err}\`\`\``)
    }

    async melonchart(){
        let date = moment(Date.now()).tz('Asia/Seoul')
        let yoru = ''
        let melon = require('melon-chart-api')
        const { data } = await melon(date.format('DD/MM/YYYY'), { cutLine: 10 }).realtime()
        data.forEach(element => {
            yoru += `**${element.rank}위**\n${element.title} - ${element.artist}\n`
        })
        return this.embed.setTitle('멜론차트').setDescription(yoru)
    }

    _formatTime(ms) {
        return moment.duration(ms).format('HH:mm:ss')
    }
}