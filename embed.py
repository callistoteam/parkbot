import discord

async def play(channel, data):
    embed=discord.Embed(
        title = data["title"],
        url = data["webpage_url"],
    )
    embed.set_thumbnail(
        url=data["thumbnail"]
    )
    embed.set_author(
        name = "음악 재생"
    )

    return await channel.send(embed=embed)