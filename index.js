require('dotenv').config();
const { Client } = require('discord.js');
const client = new Client({ intents: ['GUILD_PRESENCES'] })
const config = require('./config.json');
const request = require('request');

//Bliver kørt hvis botten starter korrekt
client.on('ready', () => {
    console.log(`Loggede ind som ${client.user.tag}!`);
    function updatePlayerCount() {
        request.get({
            url: `https://servers-frontend.fivem.net/api/servers/single/${config.cfxip}`,
            json: true,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0' }
        }, (err, res, data) => {
            if (err) {
                console.log('Error:', err);
            } else if (res.statusCode !== 200) {
                //server offline
                client.user.setPresence({
                    status: config.activity.status,
                    activities: [{
                        name: 'Server Offline',
                        type: config.activity.type
                    }]
                })
            } else {
                //Server Online
                const spillere = data['Data']['clients'];
                if (spillere !== undefined) {
                    //Antal spillere i alt
                    const maxPlayers = data['Data']['sv_maxclients'];
                    client.user.setPresence({
                        status: config.activity.status,
                        activities: [{
                            name: `${spillere}/${maxPlayers} online`,
                            type: config.activity.type
                        }]
                    })
                } else {
                    //Antal spillere ikke fundet
                    client.user.setPresence({
                        status: config.activity.status,
                        activities: [{
                            name: 'Server Offline',
                            type: config.activity.type
                        }]
                    })
                }
            }
        });
    }

    //Update status hver 5 sekunder
    setInterval(updatePlayerCount, 5000);
});

client.login(process.env.DISCORD_TOKEN);