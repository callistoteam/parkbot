const Command = require('../../structures/Command')

module.exports = class SetEQ extends Command {
    constructor(client){
        super(client)
        this.alias = [ '이퀄라이저', 'eq', 'seteq' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        let entries1 = message.data.arg.join(' ').split('--');
        entries1.shift();
        let entries = entries1.filter(function(item) {
            return item !== null && item !== undefined && item !== '';
        })
        let equaliser = [];

        for (let eq of entries) {
            let band
            let gain 
            [ band, gain ] = eq.trim().split(/ +/g);

            if (isNaN(band) || isNaN(gain)) continue;
            if (parseInt(band) > 14 || parseInt(band) < 0) return message.reply('밴드는 0 에서 14 사이어야해!');
            if (parseFloat(gain) < -0.25 || parseFloat(gain) > 1) return message.reply('Gain은 -0.25 에서 1 사이어야해!')

            equaliser.push({ band: parseInt(band), gain: parseFloat(gain) });
        }

        equaliser.length ? player.EQBands(equaliser) : player.EQBands();

        message.reply('이퀄라이저가 업데이트되었어.')
    }
}