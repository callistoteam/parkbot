const Command = require("../../structures/Command");

module.exports = class Stop extends Command {
    alias = [ "stop", 'ㄴ새ㅔ' ]
    permission = 0x0

    async execute({ client, message }){
        const player = await client.music.playerCollection.get(message.guild.id)
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        await player.destroy()
        message.channel.send(`큐를 초기화하고 보이스 채널을 나갔어. 그럼 난 이만 :wave:`)
    }
}