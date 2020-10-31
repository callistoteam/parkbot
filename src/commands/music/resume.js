const { Command } = require('../../utils')

module.exports = class Resume extends Command {
    constructor(client){
        super(client)
        this.alias = [ '일시정지해제', 'resume' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        try{
            player.resume()
            // eslint-disable-next-line
        } catch {
            return message.reply('플레이어가 재생중이야. `#pause`로 플레이어를 일시 중지하고 커맨드를 실행해봐.')
        }
        
        message.channel.send('음악을 다시 재생할게!')
    }
}