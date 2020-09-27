/* eslint-disable */
const { Command } = require('../../utils')

function filter() {
    var i = 0;
  
    return function(key, value) {
        if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
            return '[Circular]'; 
  
        if(i >= 1000) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';
  
        ++i; // so we know we aren't using the original object anymore
  
        return value;
    }
}
  
function stringify(item, censor, space) {
    return JSON.stringify(item, censor ? censor : filter(item), space)
}

module.exports = class Compile extends Command {
    constructor(client) {
        super(client)
        this.alias = [ 'compile', 'eval' ]
        this.permission = 0x16
        this.category = 'dev'
    }

    async execute({ client, message, player }){
        let code_in_time = new Date()
        let code_in = 'const Discord = require(\'discord.js\')\nconst child = require(\'child_process\')\nconst fetch = require(\'node-fetch\')\nconst client = this.client\n\n'+message.data.args
        let type
        try {
            // eslint-disable-next-line security/detect-eval-with-expression
            const result = new Promise((resolve) => resolve(eval(code_in)))
            let result_time = new Date()
            let time = result_time - code_in_time
            result.then(res => {
                let code = type = res

                if (typeof code !== 'string')
                    code = require('util').inspect(code, {depth: 0})
                if (code_in.length > 1000) {
                    code_in = code_in.substr(0, 1000) + '\n(1000자 이상..'
                }
                if (typeof type === 'function') {
                    code = type.toString()
                }
                if (code.length > 1000) {
                    code = code.substr(0, 1000) + '\n(1000자 이상..'
                }
                message.channel.send(`:outbox_tray: 출력\n\`\`\`js\n${code} \n\`\`\``)
                message.channel.send(`\`${time}\`ms`)
            }).catch(e => {
                let err = e.stack || e
                if (code_in.length > 1000) {
                    code_in = code_in.substr(0, 1000) + '\n(1000자 이상..'
                }
                if (err.length > 1000) {
                    err = err.substr(0, 1000) + '\n(1000자 이상..'
                }
                message.channel.send(`:outbox_tray: 오류\n\`\`\`js\n${e} \n\`\`\``)
            })
            
        } catch (e) {
            let err = e.stack || e
            if (code_in.length > 1000) {
                code_in = code_in.substr(0, 1000) + '\n(1000자 이상..'
            }
            if (err.length > 1000) {
                err = err.substr(0, 1000) + '\n(1000자 이상..'
            }
            message.channel.send(`:outbox_tray: 오류\n\`\`\`js\n${e} \n\`\`\``)
        }
    }
}