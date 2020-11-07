const Sharder = require('./client').Sharder
// eslint-disable-next-line node/no-unpublished-require
const Bot = new Sharder(require('../config.js'))

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