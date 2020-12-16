import config
import commands
import re
ns = "> 해당 서버에서 재생중인 음악이 없는거같아 :("

URL_REGEX = re.compile(
    r"https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
)

async def execute(app, Audio, message, args, command):
    if command in commands.play:
        if not message.author.voice:
            return await message.channel.send("> 먼저 보이스 채널에 들어가줘.")

        vc = Audio.getVC(message.guild)

        if not vc:
            await Audio.connect(message.author.voice.channel)
            vc = Audio.getVC(message.guild)

        if not hasattr(vc, "channel"):
            vc.channel = message.channel

        if not args[1:]:
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

        if not args[1:]:
            offset = 50
        else:
            offset = int(args[1])

        Volume = await vc.setVolume(offset / 100)

        return await message.channel.send(f"> 볼륨을 `{Volume * 100}%`로 설정했어.")

    if command in commands.skip: 
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        await vc.skip(1)

        return await message.channel.send(f"현재 재생중인 음악을 스킵했어.")

    if command in commands.autoplay:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        if not args[1:]:
            return await message.channel.send(f"> 사용법: `{args[0]} [on 또는 off]`")
        if not args[1] in ["on", "off"]:
            return await message.channel.send(f"> 사용법: `{args[0]} [on 또는 off]`")

        offset = args[1]

        offset = {"on": True, "off": False}.get(offset, True)

        autoplay = await vc.setAutoplay(offset)

        return await message.channel.send(
            f'추천 영상 재생이 {"활" if autoplay else "비활"}성화 되었어.'
        )

    if command in commands.crossfade:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        if not args[1:]:
            offset = 5
        else:
            try:
                offset = int(args[1])
            except:
                return await message.channel.send("정수를 입력해줘..!")

        Crossfade = await vc.setCrossfade(offset)

        return await message.channel.send(
            f"크로스페이드를 `{Crossfade}`초로 설정했어."
        )

    if command in commands.nowplay:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        Data = await vc.getState()

        return await message.channel.send(
            f'현재 재생중: {Data["current"]["title"]} `{Data["position"]}:{Data["duration"]}`'
        )

    if command in commands.queue:
        vc = Audio.getVC(message.guild)

        if not vc:
            return await message.channel.send(ns)

        State = await vc.getState()
        Queue = await vc.getQueue()
        QueueText = "\n".join(
            [str(Queue.index(Item) + 1) + ". " + Item["title"] for Item in Queue]
        )

        return await message.channel.send(
            f"""
현재 재생중: {State["current"]["title"]} `{State["position"]}:{State["duration"]}`
{QueueText}
"""
        )