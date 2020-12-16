import time
import commands
import config

async def execute(app, message, args, command):
    if command == "ping":
        before = time.monotonic()
        msg = await message.channel.send('퐁!')
        now = time.monotonic()-before
        ping = now*1000
        await msg.edit(content=f"{ping}ms")

    if command == "logout":
        if not message.author.id in config.owner: return
        await app.logout()
