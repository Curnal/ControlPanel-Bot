const Discord = require("discord.js");
const PastebinAPI = require('pastebin-js');

exports.run = (client, message, args) => {

    if (!client.isOwner(message)) { return; }

    let key = client.config.api.pastebin;

    const pastebin = new PastebinAPI({ 'api_dev_key' : key });

    let servers = "";

    client.guilds.cache.forEach(g => {
        servers = servers + `Guild: ${g.name} - MemberCount: ${g.memberCount}\n\n`;
    });

    pastebin.createPaste("Servers: \n" + servers, "Servers").then(function (data) {
        return client.sendEmbed(message.author, "Success!", `[Click Here](${data})`);
    }).fail(function (err) {
        console.log(err);
        client.sendErrorEmbed(message.channel, "An error has occured")
        return;
    });

    client.sendEmbed(message.channel, "Check your dms!");

    return;

}

module.exports.help = {
    name: "servers",
    description: "Generates a pastebin link with all the current guilds",
    dm: true,
    aliases: []
}