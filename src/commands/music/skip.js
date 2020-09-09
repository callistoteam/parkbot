const Command = require('../../structures/Command')

module.exports = class Skip extends Command {
    constructor(client){
        super(client)
        this.alias = [ '스킵', 'skip', 's', '스킵' ]
        this.permission = 0x0
        this.voiceChannel = true
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        if(player.queue.size === 0) return message.reply('스킵한 후에 재생할 곡이 없어!')
        message.channel.send('스킵하려면 보이스 채널에 있는 과반수 이상의 사람이 동의해야해! ✅이모지를 눌러서 동의해줘!').then(msg => {
            msg.react('✅')
            const collector = msg.createReactionCollector(
                (reaction) => ['✅'].includes(reaction.emoji.name),
                {time: 60000}
            )
    
            let yoruyoru = msg.member.voice.channel.members.size
            let skipVote = -1
    
            collector.on('collect', reaction => {
                if(reaction.emoji.name == '✅') skipVote += 1

                if(yoruyoru / 2 < skipVote){
                    player.play()
                    message.reply('하나의 곡을 건너뛰었어.')
                    skipVote = -9999999999999999
                }
            })
        })
    }
}