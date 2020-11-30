const request = require('request');
const Discord = require("discord.js");

exports.run = async (client, message, args, guildConf) => {

    let panel = guildConf.panel.url;
    let key = guildConf.panel.apiKey;

    if (!panel) return client.sendErrorEmbed(message.channel, "No panel has been setup!");
    if (!key) return client.sendErrorEmbed(message.channel, "No panel api key has been setup!");

    let servers;
    let nodes;
    let users;
    let nests;

    request.get(`${panel}/api/application/servers`, {
        auth: {
            bearer: key
        }
    }, async function(err, response, body) {

        if (err) return client.sendErrorEmbed(message.channel, "Could not connect to panel");
        if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid admin api key!");

        body = JSON.parse(body);
        servers = body.meta.pagination.total;

        client.log("PTERODACTYL", `${guildConf.panel.url} -> fetched servers`);

        request.get(`${panel}/api/application/nodes`, {
            auth: {
                bearer: key
            }
        }, async function(err, response, body) {

            if (err) return client.sendErrorEmbed(message.channel, "Could not connect to panel");
            if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid admin api key!");

            body = JSON.parse(body);
            nodes = body.meta.pagination.total;

            client.log("PTERODACTYL", `${guildConf.panel.url} -> fetched nodes`);

            request.get(`${panel}/api/application/users`, {
                auth: {
                    bearer: key
                }
            }, async function(err, response, body) {

                if (err) return client.sendErrorEmbed(message.channel, "Could not connect to panel");
                if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid admin api key!");

                body = JSON.parse(body);
                users = body.meta.pagination.total;

                client.log("PTERODACTYL", `${guildConf.panel.url} -> fetched users`);

                request.get(`${panel}/api/application/nests`, {
                    auth: {
                        bearer: key
                    }
                }, async function(err, response, body) {

                    if (err) return client.sendErrorEmbed(message.channel, "Could not connect to panel");
                    if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid admin api key!");

                    body = JSON.parse(body);
                    nests = body.meta.pagination.total;

                    client.log("PTERODACTYL", `${guildConf.panel.url} -> fetched nests`);

                    await client.sendEmbed(message.channel, "Panel", ``, [
                        {
                            name: "Stats",
                            value: `
Servers: ${servers}
Nodes: ${nodes}
Users: ${nodes}
`
                        },
                        {
                            name: "Other",
                            value: `
Nests: ${nests}
`
                        }
                    ])

                });

            });

        });


    });

}

module.exports.help = {
    name: "panel",
    description: "Shows panel stats",
    cooldown: 15,
    aliases: []
}
