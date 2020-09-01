const Command = require('../../structures/Command')

module.exports = class Delete extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'delete', '삭제', '제거' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!message.data.args) return message.reply('삭제할 곡 번호를 입력해줘.')
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        const num = parseInt(message.data.arg[0])
        if(!player.queue.has(num)) return message.reply('정확한 숫자를 입력해줘.')

        player.queue.delete(num + 1)
        message.reply('큐 목록에서 해당 음악을 제거했어.')
    }
}