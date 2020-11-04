const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = userConf.apiKey;

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!"); }
    if (!key) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    if (userConf.focused === null) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    request.get(`${panel}/api/client/servers/${userConf.focused}/power`, {
        'auth': {
            'bearer': key
        },
        json: {
            signal: 'stop'
        }
    }, async function(err, response, body) {
        
        if (err) { return client.sendErrorEmbed(message.channel, "An error has occured"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid api key!"); }

        await client.sendEmbed(message.channel, `Server stopping!`);

    });

    return;

}

module.exports.help = {
    name: "stop",
    description: "Stops the focused server",
    dm: false,
    cooldown: 2,
    aliases: ["stopserver"]
}