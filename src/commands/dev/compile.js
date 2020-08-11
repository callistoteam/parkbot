const Command = require('../../structures/Command')

module.exports = class Compile extends Command {
    constructor(client) {
        super(client)
        this.alias = [ 'compile', 'eval' ]
        this.permission = 8
        this.category = 'dev'
    }

    async execute({ message }){
        let code_in = 'const Discord = require(\'discord.js\')\nconst child = require(\'child_process\')\nconst fetch = require(\'node-fetch\')\nconst client = this.client\n\n'+message.data.args
        let type
        try {
            // eslint-disable-next-line security/detect-eval-with-expression
            const result = new Promise((resolve) => resolve(eval(code_in)))
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