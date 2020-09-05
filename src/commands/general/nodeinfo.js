const Command = require('../../structures/Command')
const { MessageEmbed } = require('discord.js')

function formatTime(ms) {
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

module.exports = class Nodeinfo extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'nodeinfo', '노드정보' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ message }){
        try{
            await message.channel.send('잠시만 기다려주세요').then(async msg => {
                const premiumStat = this.client.premiumMusic.nodeCollection.KVArray()[0][1].stats
                const normalStat = this.client.music.nodeCollection.KVArray()[0][1].stats
                const nodeEmbed = new MessageEmbed
                nodeEmbed.setTitle('노드 정보')
                nodeEmbed.addField('Premium Server', `서버위치: \`KR\`\n재생하고있는 서버 수: ${premiumStat.playingPlayers}\n메모리사용량: ${(premiumStat.memory.used / 1024 / 1024).toFixed(2)}MB\n업타임: ${formatTime(premiumStat.uptime)}`, true)
                nodeEmbed.addField('Normal Server', `서버위치: \`KR\`\n재생하고있는 서버 수: ${normalStat.playingPlayers}\n메모리사용량: ${(normalStat.memory.used / 1024 / 1024).toFixed(2)}MB\n업타임: ${formatTime(normalStat.uptime)}`, true)
                msg.edit('', nodeEmbed)
            })
        }catch(e) {
            message.reply('알 수 없는 오류가 발생했어요.')
            console.log(e)
        }
    }
}