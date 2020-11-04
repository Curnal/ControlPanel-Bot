const Discord = require('discord.js');
const request = require('request');
const ping = require('ping');

exports.run = async (client, message, args, guildConf, userConf) => {
    
    return client.sendErrorEmbed(message.channel, "Command has been disabled for now...");

    let panel = guildConf.panel.url;
    if (panel === "" || panel === null) { return client.sendErrorEmbed(message.channel, "Panel has not be setup!"); }

    panel = panel.replace(/(^\w+:|^)\/\//, '');

    let result = await ping.promise.probe(panel);

    if (result.alive === false) {

        client.sendEmbed(message.channel, "Panel Status", "", [
            {
                name: "Host",
                value: `URL: ${panel}`
            },
            {
                name: "Status",
                value: ":x: Offline"
            }
        ]);
        return;

    }

    client.sendEmbed(message.channel, "Panel Status", "", [
        {
            name: "Host",
            value: `URL: ${body.host}\nIP: ${body.numeric_host}\nAlive: ${body.alive}`
        },
        {
            name: `Ping`,
            value: `Lowest: ${body.min} MS\nHighest: ${body.max} MS\nAverage: ${body.avg} MS`
        }
    ])

    return;

}

module.exports.help = {
    name: "panel",
    description: "Checks the panel's status",
    dm: true,
    cooldown: 5,
    aliases: ["p"]
}