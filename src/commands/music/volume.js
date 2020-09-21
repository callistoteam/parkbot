const { Command } = require('../../utils')

module.exports = class Volume extends Command {
    constructor(client){
        super(client)
        this.alias = [ '음량', '볼륨', 'volume', 'vol', '패ㅣㅕㅡㄷ' ]
        this.permission = 0x0
        this.args = [ { name: '볼륨', required: true } ]
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        const volume = message.data.args
        
        if(isNaN(volume) || parseInt(volume) > 100 || parseInt(volume) < 0) return message.reply('볼륨은 0부터 100사이의 정수여야 해!')
        player.setVolume(parseInt(volume))

        await message.channel.send(`볼륨이 \`${player.volume}%\`로 변경되었어!`)
    }
}