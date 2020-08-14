// eslint-disable-next-line node/no-extraneous-require 
const fetch = require('node-fetch')

fetch(process.env.WEBHOOK, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: '{"req": "pull"}'
}).then(res => console.log(JSON.stringify(res.json())))