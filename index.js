require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.GuildPresences] })
const config = require('./config.json');
const request = require('request');

client.on('ready', () => {
    console.log(`Loggede ind som ${client.user.tag}!`);
    function updatePlayerCount() {
        request.get({
            url: `https://servers-frontend.fivem.net/api/servers/single/${config.cfxip}`,
            json: true,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0' }
        }, (err, res, _data) => {
            if (err) {
                console.log('Error:', err);
                return
            }

            const data = _data['Data'];

            if (res.statusCode !== 200 || data?.clients == undefined) {
                client.user.setPresence({
                    status: config.activity.status,
                    activities: [{
                        name: 'Server Offline',
                        type: ActivityType.Listening
                    }]
                })
                return
            }

            const spillere = data?.clients;
            const maxPlayers = data?.sv_maxclients;

            client.user.setPresence({
                status: config.activity.status,
                activities: [{
                    name: `${spillere}/${maxPlayers} online`,
                    type: ActivityType.Watching
                }]
            })
        });
    }

    // Opdaterer bottens status hvert minut
    setInterval(updatePlayerCount, 60000);

    // Opdaterer statusen med det samme
    updatePlayerCount();

});

client.login(process.env.DISCORD_TOKEN);