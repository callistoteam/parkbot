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
        if(message.author.data.premium > new Date){
            if(message.author.data.color) this.embed.setColor(message.author.data.color)
            if(!message.author.data.color) this.embed.setColor('RANDOM')
        } else {
            this.embed.setColor('RANDOM')
        }
    }

    /* async trackPlay (title, length, url, guild, knex) {
        await knex('guild').update({uri: url}).where('id', guild)
        return this.embed.setAuthor('음악 재생')
            .setTitle(`${title}`)
            .setDescription(
                `신청자: ${user} | 길이: ${this._formatTime(length)}`
            )
            .setURL(url)
            .setThumbnail(thumbnail.medium)
            .setColor('RANDOM')
    } */

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

    nowPlay(player, server) {
        let music = player.queue.get(1)
        let nowsecond = moment.duration(player.position).format('HH시간 mm분 ss초')
        let fsecond = moment.duration(music.length ? music.length : '알 수 없음').format('HH시간 mm분 ss초')
        return this.embed
            .setDescription(`<a:playforpark:708621715571474482> [${music.title}](${music.uri})
            ⏰ \`${nowsecond}\` / \`${fsecond}\`
            > 음악 재생 서버: \`${server}\`서버
            `)
            .setThumbnail(music.thumbnail.high)
            .setFooter(`음악 출처: ${music.author}`)
    }

    premium(user) {
        var now = new Date(parseInt(user.premium))
        var year = now.getFullYear()
        var hour = now.getHours()

        let month = now.getMonth() + 1 + '월'
        let day = now.getDate() + '일'
        let daytime = hour >= 12 ? '오후' : '오전'
        let time = hour%12+'시' + now.getMinutes() + '분'
        let dow = ['일','월','화','수','목','금','토','일'][now.getDay()]+'요일'

        let rt = `${year}년 ${month}${day} ${dow} ${daytime} ${time}`
        let desc = `
파크봇은 일부 유료화로,  기존 서비스는 동일하게 이용할 수 있지만 정액제/1회성 회원권(이하 '프리미엄')으로 질 높은 음악을 제공합니다.
**혜택**
▶️ **향상된 음악 품질**
많은 유저들이 이용하는 서버와 프리미엄을 소유하고 있는 유저들을 위한 음악 서버는 분리되어 있어 쾌적한 서버에서 음악을 즐기실 수 있습니다.
⚡ **업데이트 스포일러**
업데이트 예정 기능들을 빠르게 아실 수 있습니다.
📱 **4/7 서포트**
기존 3/5 서포트와 달리 프리미엄을 소유하고 있는 유저들만을 위한 전용 이메일로 문의를 하실 수 있습니다.
<a:loadingforpark:702385005590085632> **Embed 색 커스텀**
기존 랜덤 EMBED색과는 달리 자신이 원하는 색으로 대부분의 EMBED색을 변경하실 수 있습니다.(\`#컬러 [hex코드]\`)

**가격**
프리미엄 3일: 70포인트
프리미엄 14일: 250포인트
프리미엄 31일: 500포인트
프리미엄 90일: 1000포인트
\`#구매 [일수]\`(예시: \`#구매 14일\`)

**정보**
프리미엄 여부: ${user.premium > new Date ? '참' : '거짓'}
프리미엄 만료일: ${rt}
        `
        return this.embed.setTitle('파크봇 프리미엄').setDescription(desc)
    }

    weather(res) {
        return this.embed
            .setTitle(`\`${res.name}\` - \`${res.sys.country}\``)
            .addField('현재 날씨', `${res.weather['0'].main} - ${res.weather['0'].description}`)
            .addField('현재 온도', `실제 온도: ${res.main.temp}°C\n체감 온도: ${res.main.feels_like}`)
    }

    nodeinfo(nor, pre){
        return this.embed
            .setTitle('노드 정보')
            .addField('Premium Server', `서버위치: \`US\`\n재생하고있는 서버 수: ${pre.playingPlayers}\n메모리사용량: ${(pre.memory.used / 1024 / 1024).toFixed(2)}MB\n업타임: ${this._formatTime(pre.uptime)}`, true)
            .addField('Normal Server', `서버위치: \`KR\`\n재생하고있는 서버 수: ${nor.playingPlayers}\n메모리사용량: ${(nor.memory.used / 1024 / 1024).toFixed(2)}MB\n업타임: ${this._formatTime(nor.uptime)}`, true)
    }

    embedcolor(color) {
        return this.embed.setColor(color).setDescription('앞으로 이 색으로 출력할게!')
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
        return moment.duration(ms).format('HH시간 mm분 ss초')
    }
}