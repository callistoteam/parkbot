import config
import db
import logging
import time
import discord

app = discord.Client()
@app.event
async def on_ready():
    print(f"bot : {app.user}")

@app.event
async def on_message(message):
    await app.wait_until_ready()
    if message.author.bot: return
    if not message.content.startswith(config.prefix): return

    args = message.content.split(' ')
    command = args[0].replace(config.prefix, '')

    print(command)

    if command == "ping":
        before = time.monotonic()
        msg = await message.channel.send('퐁!')
        now = time.monotonic()-before
        ping = now*1000
        await msg.edit(content=f"{ping}ms")

    if command == "logout":
        if not message.author.id in config.owner: return
        await app.logout()

app.run(config.token)