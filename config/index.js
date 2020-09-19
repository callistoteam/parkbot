module.exports = {
    mode: 'production',
    client: {
        token: 'NzM4NjU2OTQ5OTI2NzU2NDIz.XyPF5A.XOwy8JwXadLSAdDQO-1PZsiWj6s',
        prefix: '!!',
        noticechannel: '742256562277449838',
        statusList: ['#help | parkbot.ml', '#help | 디스코드를 흥겹게!', '#도움말 | parkbot.ml'],
        dev: ['480240821623455746'],
        team: []
    },
    api: {
        weather: 'eca7063c7d7543f705a9549cca7366a2'
    },
    database: {
        client: 'mysql',
        connection: {
            host: 'yoru.ml',
            user: 'parkbot',
            password: 'tuntun0504',
            database: 'parkbot_db',
            charset: 'utf8'
        },
        debug: false,
        pool: {
            max: 10
        },
        acquireConnectionTimeout: 60000
    },
    lavalink: {
        nodes: [
            {
                host: 'lavalink.lostarkbot.ga',
                port: 5000,
                password: 'By3W04Ld',
                retries: 5
            }
        ],
        premiumnodes: [
            {
                host: 'localhost',
                port: 5000,
                password: '652867CU66eB7YGs7JqU66Oo',
                retries: 5
            }
        ]
    }
}