const Discord = require('discord.js');
const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = guildConf.panel.apiKey;

    if (!panel) return client.sendErrorEmbed(message.channel, "No panel has been setup!");
    if (!key) return client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!account link API-KEY");

    request.post(`${panel}/api/application/users`, {
        'auth': {
            'bearer': key
        },
        json: data
    }, async function(err, response, body) {

        console.log(response)

        if (err) return client.sendErrorEmbed(message.channel, "An error has occured");
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid api key!"); }

        await client.sendEmbed(message.channel, `Your account has been created!`);
        await client.sendEmbed(message.author, `Account Details`, `**Username**: ${username}\n**Email**: ${email}\n**Password**: ${password}`);

    });

    return;

}

module.exports.help = {
    name: "startall",
    description: "Starts all servers on the panel",
    dm: false,
    aliases: ["sa"]
}
