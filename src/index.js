const utils = require('./utils')
const Client = require('./structures').Client

const config = utils.getConfig()

const ParkBot = new Client(config)

ParkBot.init()

process.on('uncaughtException', (err) => {
    console.error(err)
})
  
process.on('unhandledRejection', (reason, promise) => {
    console.error(`UnHandledRejection: ${reason}, Promise: ${promise}`)
    promise.catch((e) => {
        console.error(e.stack)
    })
})