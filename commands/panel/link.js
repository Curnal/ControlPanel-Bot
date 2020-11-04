const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = args[0];

    await message.delete();

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!")}
    if (!key) { return await client.sendErrorEmbed(message.channel, "You must provide your api key!\nDo: cp!link API-KEY")}

    request.get(`${panel}/api/client`, {
        'auth': {
            'bearer': key
        }
    }, async function(err, response, body) {

        if (err) { return await client.sendErrorEmbed(message.channel, "An error has occured!"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid api key!"); }

        client.userDB.set(`${message.author.id}-${message.guild.id}`, key, "apiKey");
        client.sendEmbed(message.channel, "Your account has been linked!");
        return;
    
    });

}

module.exports.help = {
    name: "link",
    description: "Link your panel account with your discord",
    dm: false,
    cooldown: 2,
    aliases: ["sync"]
}