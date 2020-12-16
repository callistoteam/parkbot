import time
import commands
import embed
import config
import commands
from requests import get
import json

async def execute(app, message, args, command):
    if command == "ping":
        before = time.monotonic()
        msg = await message.channel.send('<a:loadingforpark:702385005590085632>')
        now = time.monotonic()-before
        ping = now*1000
        await msg.edit(content=f"{ping}ms")

    if command in commands.hangang:
        response = get(config.hangang)
        await embed.hangang(message, response.content.decode('utf-8'))

    if command == "logout":
        if not message.author.id in config.owner: return
        await app.logout()
