const Command = require('../../structures/Command')

module.exports = class Volume extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'volume', 'vol', '패ㅣㅕㅡㄷ' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        const volume = message.data.args
        if(!volume) return message.reply('볼륨을 입력해 줘!')
        
        if(isNaN(volume) || parseInt(volume) > 100 || parseInt(volume) < 0) return message.reply('볼륨은 0부터 100사이의 정수여야 해!')
        player.setVolume(parseInt(volume))

        await message.channel.send(`볼륨이 \`${player.volume}%\`로 변경되었어!`)
    }
}