const Discord = require("discord.js");
const moment = require("moment");
const request = require("request");

exports.run = async (client, message, args, guildConf, userConf) => {

    if (!message.member.hasPermission("ADMINISTRATOR") && !client.isOwner(message)) { return await client.sendErrorEmbed(message.channel, `Insufficient Permissions`);}

    let panel = guildConf.panel.url;
    let key = guildConf.panel.apiKey;

    let nestID = args[0];
    if (!nestID) { return await client.sendErrorEmbed(message.channel, "You must provide an egg id"); }

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!"); }
    if (!key) { return await client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!link API-KEY"); }

    request.get(`${panel}/api/application/nests/${nestID}/eggs`, {
        'auth': {
            'bearer': key
        }
    }, async function(err, response, body) {

        if (err) { return client.sendErrorEmbed(message.channel, "Could not connect to panel"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid admin api key!"); }

        try {
            var body = JSON.parse(body);
        } catch(e) {
            return await client.sendErrorEmbed(message.channel, "An error has occured!");
        }
        body = body.data;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Nest Eggs`)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)

            for (let i = 0; i < body.length && i < 10; i++) {
                let egg = body[i].attributes;
                embed.addField(`${egg.id}. ${egg.name}`, `
                **Author**: ${egg.author}
                **DockerImage**: \`\`\`${egg.docker_image}\`\`\`
                **Startup**: \`\`\`${egg.startup}\`\`\`

                **Created**: ${moment(new Date()).diff(egg.created_at, 'days') + ' days ago'}
                **Last Updated**: ${moment(new Date()).diff(egg.updated_at, 'days') + ' days ago'}`, true)
            }

        await message.channel.send(embed);

    });


}

module.exports.help = {
    name: "eggs",
    description: "Shows all of the a nest's eggs",
    dm: true,
    aliases: []
}