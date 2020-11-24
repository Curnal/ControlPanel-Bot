const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = userConf.panel.apiKey;

    if (!panel) return client.sendErrorEmbed(message.channel, "No panel has been setup!");
    if (!key) return client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!account link API-KEY");

    if (userConf.panel.focused === null) return client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!account link API-KEY");

    request.post(`${panel}/api/client/servers/${userConf.panel.focused}/power`, {
        auth: {
            bearer: key
        },
        json: {
            signal: 'start'
        }
    }, async function(err, response, body) {

        if (err) return client.sendErrorEmbed(message.channel, "An error has occured");
        if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

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
