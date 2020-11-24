const Discord = require("discord.js");
const moment = require('moment');
require('moment-duration-format');

module.exports = async (client) => {

    // Starting status
    await client.user.setActivity(`starting...`, { type: "PLAYING" });

    // Log stats
    client.log("STATS", `Servers: ${client.guilds.cache.size} - Channels: ${client.guilds.cache.map(s => s.channels.cache.size).reduce((a, b) => a + b)} - Users: ${client.guilds.cache.map(s => s.memberCount).reduce((a, b) => a + b)} - Emojis: ${client.guilds.cache.map(s => s.emojis.cache.size).reduce((a, b) => a + b)}`)

    // Bot invite
    client.invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${client.config.permissions}&scope=bot`

    // Database stats
    client.log("DATABASE", `User database has ${(client.userDB.size)} rows.`);
    client.log("DATABASE", `Server database has ${(client.serverDB.size)} rows.`);

    let statusList = [
        `cp!help || Pterodactyl `
    ];

    // Random Status
    setInterval(async () => {

        let index = Math.floor(Math.random() * (statusList.length - 1) + 1);

        await client.user.setActivity(statusList[index], { type: 'WATCHING' });

    }, 10000); // every 10 seconds

    // End Time
    let endDate = new Date();

    client.log("BOT", `Bot is online (${client.user.tag})`)

    // Started Status
    await client.user.setActivity(`started! Took ${endDate-client.startDate}ms`, { type: "PLAYING" }).then(function() {
        setTimeout(function () {
            client.user.setActivity(statusList[0], { type: 'WATCHING' })
        }, 5000)
    });

};
