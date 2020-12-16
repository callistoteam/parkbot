import time
import commands
import embed
import config
import commands
from requests import get
from random import choice
import json
import discord

async def execute(app, message, args, command):
    if command == "ping":
        before = time.monotonic()
        msg = await message.channel.send('<a:loadingforpark:702385005590085632>')
        now = time.monotonic()-before
        ping = now*1000
        await msg.edit(content=f"{ping}ms")

    if command in commands.h:
        colour = ''.join([choice('0123456789ABCDEF') for x in range(6)])
        colour = int(colour, 16)

        he=discord.Embed(
            colour=discord.Colour(value=colour),
        )
        he.add_field(name='**파크봇**', value=commands.parkbot, inline=False)
        he.add_field(name='**음악**', value=commands.music)
        he.add_field(
            name="유용한 링크",
            value="[초대하기](https://parkbot.ml)\n[지원 서버](https://discord.gg/jE33mfD)\n[이용약관](https://parkbot.ml/tos)\n[개인정보처리방침](https://parkbot.ml/privacy)",
            inline=False,
        )

        return await message.channel.send(embed=he)

    if command in commands.hangang:
        response = get(config.hangang)
        await embed.hangang(message, response.content.decode('utf-8'))

    if command == "logout":
        if not message.author.id in config.owner: return
        await app.logout()
