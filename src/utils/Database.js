module.exports.getGuildData = async (client, message) => {
    let guilddb = await client.knex('guild').select(['id', 'uri', 'prefix'])
    let guilddata = guilddb.find(as => as.id == message.guild.id)
    if(!guilddata) {
        await knex('guild').insert({id: message.guild.id, uri: '', prefix: '#'})
        guilddb = await client.knex('guild').select(['id', 'uri', 'prefix'])
        guilddata = guilddb.find(as => as.id == message.guild.id)
    }
    return guilddata
}