import config
import db
import logging
logging.basicConfig(level=logging.INFO)
import discodo
import re
import time
import discord

app = discord.Client()
Audio = discodo.DPYClient(app)
Audio.register_node("127.0.0.1", 8000, password="hellodiscodo")

URL_REGEX = re.compile(
    r"https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
)

@app.event
async def on_ready():
    print(f"bot : {app.user}")

@Audio.event("SOURCE_START")
async def sendPlaying(VC, Data):
    await VC.channel.send(f'playing {Data["source"]["title"]}')


@Audio.event("SOURCE_END")
async def sendStopped(VC, Data):
    await VC.channel.send(f'{Data["source"]["title"]} Done')

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

    if command == "play":
        if not message.author.voice:
            return await message.channel.send("> 먼저 보이스 채널에 들어가줘.")

        vc = Audio.getVC(message.guild)

        if not vc:
            await Audio.connect(message.author.voice.channel)
            vc = Audio.getVC(message.guild)

        if not hasattr(vc, "channel"):
            vc.channel = message.channel

        Source = await vc.loadSource(" ".join(args[1:]))

        if isinstance(Source, list):
            return await message.channel.send(
                f'{len(Source) - 1} songs except {Source[0]["title"]} added.'
            )
        else:
            print(Source)
            return await message.channel.send(f'{Source[0]["title"]} added.')

    if command == "stop":
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send("> 해당 서버에서 재생중인 음악이 없는거같아 :(")

        await vc.destroy()

        return await message.channel.send(f"큐를 초기화하고 보이스 채널을 나갔어.")

    if command == "logout":
        if not message.author.id in config.owner: return
        await app.logout()

app.run(config.token)