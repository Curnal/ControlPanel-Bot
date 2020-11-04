const request = require('request');
const Discord = require("discord.js");
const PastebinAPI = require('pastebin-js');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = userConf.apiKey;

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!")}
    if (!key) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY")}

    request.get(`${panel}/api/client`, {
        'auth': {
            'bearer': key
        }
    }, async function(err, response, body) {
        
        if (err) { return client.sendErrorEmbed(message.channel, "Could not connect to panel"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid api key!"); }
        
        var body = JSON.parse(body);
        body = body.data;

        client.userDB.set(`${message.author.id}-${message.guild.id}`, body, "servers");

        const embed = new Discord.MessageEmbed()
            .setTitle("Your Servers")
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)

            for (let i = 0; i < body.length && i < 10; i++) {
                let server = body[i].attributes;
                embed.addField(`${i+1}. ${server.name}`, `Ram: ${server.limits.memory} MB\nDisk: ${server.limits.disk} MB\nCPU Cores: ${server.limits.cpu === 0 ? "∞" : `${server.limits.cpu}%`}\nDatabases: ${server.feature_limits.databases}\nID: ${server.identifier}`, true)
            }

        embed.setDescription(body.length === 0 ? "None" : "**To focus a server**:\nDo: \`cp!focus <number>\`")

        await message.channel.send(embed);

    });


}

module.exports.help = {
    name: "listservers",
    description: "Shows all of your servers",
    dm: true,
    aliases: ["ls"]
}