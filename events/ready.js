const Discord = require("discord.js");
const moment = require('moment');
require('moment-duration-format');

module.exports = async (client) => {

    // Log stats
    client.log("STATS", `Servers: ${client.guilds.cache.size} - Channels: ${client.guilds.cache.map(s => s.channels.cache.size).reduce((a, b) => a + b)} - Users: ${client.guilds.cache.map(s => s.memberCount).reduce((a, b) => a + b)} - Emojis: ${client.guilds.cache.map(s => s.emojis.cache.size).reduce((a, b) => a + b)}`)

    // Bot invite
    client.invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${client.config.permissions}&scope=bot`

    // Database stats
    client.log("DATABASE", `User database has ${(client.userDB.size)} rows.`);
    client.log("DATABASE", `Server database has ${(client.serverDB.size)} rows.`);

    // Set Status
    await client.user.setActivity(`${client.config.dmPrefix}help || v${require('../package.json').version}`, { type: 'WATCHING' });

    // End Time
    let endDate = new Date();

    client.log("BOT", `Bot is online (${client.user.tag})`)

};
