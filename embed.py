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

async def hangang(message, temp):
    embed = discord.Embed(title='한강 수온', description='{}'.format(temp), colour=0xDEADBF)
    #embed.set_author(name=message.author, icon_url=message.author.avatar_url)

    return await message.channel.send(embed=embed)