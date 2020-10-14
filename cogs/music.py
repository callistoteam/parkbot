import discord
from discord.ext import commands
import discodo
import re

class Music(commands.Cog):
    def __init__(self, client):
        self.client = client
        self.Audio = discodo.DPYClient(client)
        self.Audio.register_node("yoruroong.iptime.org", 8000, password="hellodiscodo")

        URL_REGEX = re.compile(
            r"https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
        )

        @self.Audio.event("SOURCE_START")
        async def sendPlaying(VC, Data):
            await VC.channel.send(f'{Data["source"]["title"]}을(를) 재생할게.')

        @self.Audio.event("SOURCE_END")
        async def sendStopped(VC, Data):
            await VC.channel.send(f'{Data["source"]["title"]} 재생이 끝났어.')

    @commands.command()
    async def join(self, ctx):
        if not ctx.author.voice:
            return await ctx.send("먼저 보이스 채널에 접속해줘")

        await self.Audio.connect(ctx.author.voice.channel)
        return await ctx.send(
            f"플레이어를 생성하고 보이스 채널에 연결하였어."
        )

    @commands.command()
    async def play(self, ctx, *args):
        if not ctx.author.voice:
            return await ctx.send('먼저 보이스 채널에 접속해줘')

        try:
            vc = self.Audio.getVC(ctx.guild)
        except:
            if not ctx.author.voice:
                return await ctx.send("먼저 보이스 채널에 들어가줘.")

            await self.Audio.connect(ctx.author.voice.channel)
            return await ctx.send(
                f"플레이어가 생성되어 있지 않아서 플레이어를 생성하고 {ctx.author.voice.channel.mention} 채널에 연결했어.\n`{' '.join(args)}`커맨드를 다시 실행해줘."
            )

        if not hasattr(vc, "channel"):
            vc.channel = ctx.channel

        #ctx.content[6:].strip()
        Source = await vc.loadSource(' '.join(args))

        if isinstance(Source, list):
            return await ctx.send(
                f'{len(Source) - 1} songs except {Source[0]["title"]} added.'
            )
        else:
            return await ctx.send(f'{Source["title"]}을(를) 대기열에 추가했어.')

    @commands.command()
    async def stop(self, ctx):
        try:
            vc = self.Audio.getVC(ctx.guild)
            await vc.destroy()
            return await ctx.send(f"플레이어를 삭제하고 대기열을 초기화했어.")
        except:
            return await ctx.send("`#join`커맨드를 통해 플레이어를 먼저 생성해줘.")

    @commands.command()
    async def skip(self, ctx):
        try:
            vc = self.Audio.getVC(ctx.guild)
            Remain = await vc.skip(1)
            return await ctx.send(f"재생중인 음악을 스킵했어. {Remain}개의 음악이 대기열에 남아있어.")
        except:
            return await ctx.send("`#join`커맨드를 통해 플레이어를 먼저 생성해줘.")

    @commands.command()
    async def volume(self, ctx, volume):
        try:
            vc = self.Audio.getVC(ctx.guild)
            offset = (
                int(volume.strip()) if volume.strip() else 100
            )

            Volume = await vc.setVolume(offset / 100)
            return await ctx.send(f"{Volume * 100}%로 볼륨을 설정했어.")
        except:
            return await ctx.send("`#join`커맨드를 통해 플레이어를 먼저 생성해줘.")
            

def setup(client):
    client.add_cog(Music(client))