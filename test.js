/* eslint-disable */
let fs = require('fs')
let mm = []
client.music.playerCollection.map(m => {
    let data = ''
    let thumbnail = []
    let title = []
    for(let k of m.queue) {
        let g = k[0]
        k = k[1]
        if(g !== 1) data += `[#${g-1}] &yoru% [${k.title}] &yoru% ${formatTime(k.length)}\n`
        if(g !== 1) thumbnail.push(k.thumbnail.medium)
        if(g !== 1) title.push(k.title)
    }
    mm.push({"id": m.options.guild.id, "queue": data.replace("undefined", ""), thumbnail: thumbnail, title: title})
})

var a = {}
a.list = mm

fs.writeFile('yoru.json', stringify(a), 'utf8', function(error){
    message.channel.send("asdf")
})