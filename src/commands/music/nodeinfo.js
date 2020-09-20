const { Command } = require('../../utils')
const { MessageEmbed } = require('discord.js')
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

function formatTime(ms) {
    return moment.duration(ms).format('HH시간 mm분 ss초')
}

module.exports = class Nodeinfo extends Command {
    constructor(client){
        super(client)
        this.alias = [ '노드정보', 'nodeinfo' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ message }){
        try{
            await message.channel.send('잠시만 기다려주세요').then(async msg => {
                // const premiumStat = this.client.premiumMusic.nodeCollection.KVArray()[0][1].stats
                const normalStat = this.client.music.nodeCollection.KVArray()[0][1].stats
                const nodeEmbed = new MessageEmbed
                nodeEmbed.setTitle('노드 정보')
                /* nodeEmbed.addField('Premium Server', `서버위치: \`KR\`\n재생하고있는 서버 수: ${premiumStat.playingPlayers}\n메모리사용량: ${(premiumStat.memory.used / 1024 / 1024).toFixed(2)}MB\n업타임: ${formatTime(premiumStat.uptime)}`, true) */
                nodeEmbed.addField('Normal Server', `서버위치: \`KR\`\n재생하고있는 서버 수: ${normalStat.playingPlayers}\n메모리사용량: ${(normalStat.memory.used / 1024 / 1024).toFixed(2)}MB\n업타임: ${formatTime(normalStat.uptime)}`, true)
                msg.edit('', nodeEmbed)
            })
        }catch(e) {
            message.reply('알 수 없는 오류가 발생했어요.')
            console.log(e)
        }
    }
}