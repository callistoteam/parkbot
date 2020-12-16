import config
import commands
import embed

import db
import logging
logging.basicConfig(level=logging.INFO)
import discodo
import discord

# m
import music
import parkbot

app = discord.Client()
Audio = discodo.DPYClient(app)
Audio.register_node("127.0.0.1", 8000, password="hellodiscodo")

@app.event
async def on_ready():
    print(f"bot : {app.user}")

@Audio.event("SOURCE_START")
async def sendPlaying(VC, Data):
    await embed.play(VC.channel, Data["source"])

@app.event
async def on_message(message):
    # await app.wait_until_ready()
    if message.author.bot: return
    if not message.content.startswith(config.prefix): return

    args = message.content.split(' ')
    command = args[0].replace(config.prefix, '')

    await music.execute(app, Audio, message, args, command)
    await parkbot.execute(app, message, args, command)

app.run(config.token)