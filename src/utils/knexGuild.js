module.exports = async (knex, url, guild) => {
    await knex('guild').update({uri: url}).where('id', guild)
}