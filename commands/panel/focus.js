const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let number = args[0];

    let panel = guildConf.panel.url;
    let key = userConf.apiKey;

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!"); }
    if (!key) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    let servers = userConf.servers;

    if (!number || isNaN(number)) { return await client.sendErrorEmbed(message.channel, "You must provide a valid server number!\nDo: cp!listservers to see your servers"); }
    if (servers.length+1 < number) { return await client.sendErrorEmbed(message.channel, "Not a valid server number!\nDo: cp!listservers to see your servers"); }

    var server = servers[number-1];

    if (!server) { return await client.sendErrorEmbed(message.channel, "An error has occured"); }

    client.userDB.set(`${message.author.id}-${message.guild.id}`, server.attributes.identifier, "focused");
    
    await client.sendEmbed(message.channel, "Server Focused!", `You can run \`cp!info\` to view information about the focused server`)

    return;

}

module.exports.help = {
    name: "focus",
    description: "Focus a server from the panel",
    dm: false,
    cooldown: 1,
    aliases: ["f"]
}