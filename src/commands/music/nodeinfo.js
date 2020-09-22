const { Command, Embed } = require('../../utils')


module.exports = class Nodeinfo extends Command {
    constructor(client){
        super(client)
        this.alias = [ '노드정보', 'nodeinfo' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ message }){
        try{
            await message.channel.send('<a:loadingforpark:702385005590085632>잠시만 기다려주세요').then(async msg => {
                const premiumStat = this.client.premiumMusic.nodeCollection.KVArray()[0][1].stats
                const normalStat = this.client.music.nodeCollection.KVArray()[0][1].stats
                
                msg.edit('', new Embed(message).nodeinfo(premiumStat, normalStat))
            })
        }catch(e) {
            message.reply('알 수 없는 오류가 발생했어요.')
            console.log(e)
        }
    }
}