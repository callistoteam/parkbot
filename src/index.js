const Sharder = require('./Client').Sharder
const { getConfig } = require('./utils')
const Bot = new Sharder(getConfig())

Bot.init()

process.on('uncaughtException', (err) => {
    console.error(err)
})
  
process.on('unhandledRejection', (reason, promise) => {
    console.error(`UnHandledRejection: ${reason}, Promise: ${promise}`)
    promise.catch((e) => {
        console.error(e.stack)
    })
})