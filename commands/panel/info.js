const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = userConf.apiKey;

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!"); }
    if (!key) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    if (userConf.focused === null) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    request.get(`${panel}/api/client/servers/${userConf.focused}`, {
        'auth': {
            'bearer': key
        }
    }, async function(err, response, body) {

        if (err) { return await client.sendErrorEmbed(message.channel, "An error has occured"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid api key!"); }

        body = JSON.parse(body);
        body = body.attributes;

        request.get(`${panel}/api/client/servers/${userConf.focused}/utilization`, {
            'auth': {
                'bearer': key
            }
        }, async function(err2, response2, body2) {

            if (err) { return await client.sendErrorEmbed(message.channel, "An error has occured"); }
    
            body2 = JSON.parse(body2);
            body2 = body2.attributes;
            
            // parse state
            let state = body2.state;
            if (state === "on") {
                state = "Online";
            } else if (state === "off") {
                state = "Offline";
            } else if (state === "starting") {
                state = "Restarting"
            }

            await client.sendEmbed(message.channel, body.name, `📌 **Information**\nStatus: ${state}\nDescription: ${body.description ? body.description : "None"}\nServer Owner: ${body.server_owner ? "✅" : "❌" }\n\n📈 **Stats**\nRam: ${body2.memory.current} MB / ${body2.memory.limit === 0 ? "∞" : body2.memory.limit} MB\nDisk: ${body2.disk.current} MB / ${body2.disk.limit === 0 ? "∞" : body2.disk.limit} MB\nCPU: ${body2.cpu.current}%\n${body2.players.current > 0 ? `Players: ${body2.players.current}/${body2.players.limit}` : ""}`)
    
        });

    });

    return;

}

module.exports.help = {
    name: "info",
    description: "Gets the current focused server's information",
    dm: false,
    cooldown: 1,
    aliases: ["i"]
}