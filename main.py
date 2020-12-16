import config
import commands
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

ns = "> 해당 서버에서 재생중인 음악이 없는거같아 :("

@app.event
async def on_ready():
    print(f"bot : {app.user}")

@Audio.event("SOURCE_START")
async def sendPlaying(VC, Data):
    await VC.channel.send(f'{Data["source"]["title"]}을(를) 재생할게!')

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

    if command in commands.play:
        if not message.author.voice:
            return await message.channel.send("> 먼저 보이스 채널에 들어가줘.")

        vc = Audio.getVC(message.guild)

        if not vc:
            await Audio.connect(message.author.voice.channel)
            vc = Audio.getVC(message.guild)

        if not hasattr(vc, "channel"):
            vc.channel = message.channel

        if not args[1]:
            return await message.channel.send(f"> 올바른 사용법: `{args[0]} [음악 제목(또는 URL) - 필수]`")

        Source = await vc.loadSource(" ".join(args[1:]))

        if isinstance(Source, list):
            return await message.channel.send(
                f'{len(Source) - 1} 개의 곡을 제외한 {Source[0]["title"]} 이(가) 추가되었어.'
            )
        else:
            print(Source)
            return await message.channel.send(f'{Source["data"]["title"]} 이(가) 추가되었어.')

    if command in commands.stop:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        await vc.destroy()

        return await message.channel.send(f"큐를 초기화하고 보이스 채널을 나갔어.")

    if command in commands.volume:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        offset = (
            int(args[1]) if args[1] else 100
        )

        Volume = await vc.setVolume(offset / 100)

        return await message.channel.send(f"> 볼륨을 `{Volume * 100}%`로 설정했어.")

    if command in commands.autoplay:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        offset = (
            int(args[1]) if args[1] else "on"
        )
        offset = {"on": True, "off": False}.get(offset, True)

        autoplay = await vc.setAutoplay(offset)

        return await message.channel.send(
            f'추천 영상 재생이 {"활" if autoplay else "비활"}성화 되었어.'
        )

    if command in commands.nowplay:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        Data = await vc.getState()

        return await message.channel.send(
            f'현재 재생중: {Data["current"]["title"]} `{Data["position"]}:{Data["duration"]}`'
        )

    if command == "logout":
        if not message.author.id in config.owner: return
        await app.logout()

app.run(config.token)