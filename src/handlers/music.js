const moment = require('moment-timezone')
var youtubeThumbnail = require('youtube-thumbnail')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

class Dispatcher {
    constructor(options) {

        this.client = options.client
        this.guild = options.guild
        this.text = options.text
        this.player = options.player
        this.queue = []
        this.current = null

        this.player.on('start', () =>
            // this.text.send(await new Embed().trackPlay(this.current.info.title, this.current.info.length, this.current.info.uri, this.guild, this.client.knex)).catch(() => null)
            console.log(`Queue started @ guild "${this.guild.id}"`)
        )

        this.player.on('end', () => {
            this.play()
                .catch(error => {
                    this.queue.length = 0
                    this.destroy()
                    console.error(error)
                })
        })

        for (const playerEvent of ['closed', 'error', 'nodeDisconnect']) {
            this.player.on(playerEvent, data => {
                if (data instanceof Error || data instanceof Object) console.error(data)
                this.queue.length = 0
                this.destroy()
            })
        }
    }

    get exists() {
        return this.client.queue.has(this.guild.id)
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.destroy()
        this.current = this.queue.shift()
        await this.player.playTrack(this.current.track)
        this.text.send(this.client.SE
            .setAuthor('음악 재생')
            .setTitle(`${this.current.info.title}`)
            .setDescription(
                `길이: ${this._formatTime(this.current.info.length)}`
            )
            .setURL(this.current.info.uri)
            .setThumbnail(youtubeThumbnail(this.current.info.uri).medium.url)
            .setColor('RANDOM')
        )
    }

    destroy(reason) {
        console.debug(this.constructor.name, `Destroyed the player dispatcher guild "${this.guild.id}"`)
        if (reason) console.debug(this.constructor.name, reason)
        this.queue.length = 0
        this.player.disconnect()
        console.debug(this.player.constructor.name, `Destroyed the connection guild "${this.guild.id}"`)
        this.client.queue.delete(this.guild.id)
        this.text.send('> 대기열에 있던 모든 음악을 다 재생했어. 그럼 난 이만 👋').catch(() => null)
    }

    _formatTime(ms) {
        return moment.duration(ms).format('HH시간 mm분 ss초')
    }
}

module.exports = Dispatcher