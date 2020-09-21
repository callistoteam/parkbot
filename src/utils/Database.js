module.exports.getGuildData = async (client, message) => {
    let guilddb = await client.knex('guild').select(['id', 'uri', 'prefix'])
    let guilddata = guilddb.find(as => as.id == message.guild.id)
    if(!guilddata) {
        await client.knex('guild').insert({id: message.guild.id, uri: '', prefix: '#'})
        guilddb = await client.knex('guild').select(['id', 'uri', 'prefix'])
        guilddata = guilddb.find(as => as.id == message.guild.id)
    }
    return guilddata
}

module.exports.getUserData = async (client, message) => {
    let userdata = await client.knex('users').select(['id', 'premium', 'blacklist', 'color'])
    let authordata = userdata.find(yy => yy.id == message.author.id)
    return authordata
}

module.exports.generateUserData = async(client, message) => {
    await client.knex('users').insert({id: message.author.id, premium: '1601827684505', blacklist: '0'})
    return
}