const Discord = require("discord.js");
const PastebinAPI = require('pastebin-js');

exports.run = (client, message, args) => {

    if (!client.isOwner(message)) { return; }

    let panels = "";

    client.serverDB.forEach(s => {
        panels += `PanelURL: ${s.panel.url}\nNodes: ${s.nodes.length}\n\n`;
    });

    client.sendEmbed(message.channel, "Check your dms!");
    client.sendEmbed(message.author, "Panels", panels);

    return;

}

module.exports.help = {
    name: "panels",
    description: "Gets a list of all panels",
    dm: true,
    aliases: []
}