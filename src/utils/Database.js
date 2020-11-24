module.exports.getGuildData = async (client, message) => {
    var guildData = await client.knex('guild').where({id: message.guild.id}).then(a => a[0])
    if(!guildData) {
        await client.knex('guild').insert({id: message.guild.id, uri: '', prefix: '#'})
        guildData = await client.knex('guild').where({id: message.guild.id}).then(a => a[0])
    }
    return guildData
}

module.exports.getUserData = async (client, message) => {
    var userdata = await client.knex('users').where({id: message.author.id}).then(a => a[0])
    if(!userdata) {
        await client.knex('users').insert({id: message.author.id, premium: '0', blacklist: '0', point: '100', log: '{"log": []}', pointlog: '{"log": ["+100포인트: 신규 가입에 의한 포인트 추가"]}'})
        userdata = await client.knex('users').where({id: message.author.id}).then(a => a[0])
    }
    return userdata
}