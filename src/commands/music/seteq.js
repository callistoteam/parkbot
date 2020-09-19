const { Command } = require('../../utils')

module.exports = class SetEQ extends Command {
    constructor(client){
        super(client)
        this.alias = [ '이퀄라이저', 'eq', 'seteq' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        if(!message.data.args) return message.reply(`
이퀄라이저를 설정할 값을 입력해줘. 이퀄라이저를 설정하기 어렵다면 아래의 샘플 값을 들어봐.
\`#이퀄라이저 --1 -0.25 --1 0.25\` - 저음 강조
\`#이퀄라이저 --14 1 --14 1\` - 고음강조
\`#이퀄라이저 --7 1 --7 1\` - 저음을 지나치게 강조
\`#이퀄라이저 --0 0 --0 0\` - 기본설정
위의 샘플 값들은 개발자가 들어서 이용자의 귀하고는 차이가 있을 수 있어.
        `)

        let entries1 = message.data.arg.join(' ').split('--')
        entries1.shift();
        let entries = entries1.filter(function(item) {
            return item !== null && item !== undefined && item !== ''
        })
        let equaliser = []

        for (let eq of entries) {
            let band
            let gain 
            [ band, gain ] = eq.trim().split(/ +/g);

            if (isNaN(band) || isNaN(gain)) continue;
            if (parseInt(band) > 14 || parseInt(band) < 0) return message.reply('밴드는 0 에서 14 사이어야해!')
            if (parseFloat(gain) < -0.25 || parseFloat(gain) > 1) return message.reply('Gain은 -0.25 에서 1 사이어야해!')

            equaliser.push({ band: parseInt(band), gain: parseFloat(gain) })
        }

        equaliser.length ? player.EQBands(equaliser) : player.EQBands()

        message.reply('이퀄라이저가 업데이트되었어. (적용까지 5~10초 소요)')
    }
}