const Command = require('../../structures/Command')
// eslint-disable-next-line
const fetch = require('node-fetch')
const { Embed } = require('../../structures')

module.exports = class Weather extends Command {
    constructor(client){
        super(client)
        this.alias = [ '날씨', 'weather', 'skfTl' ]
        this.permission = 0x0
        this.category = 'useful'
    }

    async execute({ client, message }){
        if(!message.data.arg[0]) return message.reply('지역을 입력해줘')
        let reg = message.data.arg[0]
        let baseurl = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(reg)}&appid=${client.config.api.weather}&units=metric`
        let rs = await fetch(baseurl).then(res => res.json())
        let regmsg = `
지역을 찾을 수 없어. 아래와 같이 수정해봐.

\`\`\`
서울 => 서울특별시
고양 => 고양시
일산 => 일산동구
캘리포니아 => California
\`\`\`
        `
        if(rs.cod == '404') return message.reply(regmsg)
        message.reply(new Embed(message).weather(rs))
    }
}