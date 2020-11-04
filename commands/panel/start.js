const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = userConf.apiKey;

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!"); }
    if (!key) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    if (userConf.focused === null) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    request.post(`${panel}/api/client/servers/${userConf.focused}/power`, {
        'auth': {
            'bearer': key
        },
        json: {
            signal: 'start'
        }
    }, async function(err, response, body) {

        if (err) { return client.sendErrorEmbed(message.channel, "An error has occured"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid api key!"); }

        await client.sendEmbed(message.channel, `Server Starting!`);

    });

    return;

}

module.exports.help = {
    name: "start",
    description: "Starts the focused server",
    dm: false,
    cooldown: 2,
    aliases: ["startserver"]
}