module.exports = (client) => {
    client.on('guildCreate', async guild => {
        client.channels.cache.get(client.config.client.noticechannel).send(`new guild\nName:\`${guild.name}\`(${guild.id})\nOwner:${guild.owner}(@${guild.owner.id})\n\nTotal: \`${client.guilds.cache.size}\``)
        await client.knex('guild').insert({id: guild.id, uri: '', prefix: '#'})
    })

    client.on('guildDelete', async guild => {
        client.channels.cache.get(client.config.client.noticechannel).send(`left guild\nName:\`${guild.name}\`(${guild.id})\nOwner:${guild.owner}(@${guild.owner.id})`)
    })
}
