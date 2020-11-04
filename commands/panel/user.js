const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = guildConf.panel.apiKey;

    let searchKey = args[0];

    if (!panel) { return await client.sendErrorEmbed(message.channel, "No panel has been setup!")}
    if (!key) { return await client.sendErrorEmbed(message.channel, "No panel api key has been setup!")}

    if (!searchKey) { return await client.sendErrorEmbed(message.channel, "You must provide something to search by\nExample: email, uuid, id")}

    request.get(`${panel}/api/application/users`, {
        'auth': {
            'bearer': key
        }
    }, async function(err, response, body) {

        if (err) { return await client.sendErrorEmbed(message.channel, "An error has occurred"); }
        if (response.statusCode === 403) { return await client.sendErrorEmbed(message.channel, "Invalid admin api key!"); }

        body = JSON.parse(body);
        let data = body.data;
        
        let user = data.find(e => 
            e.attributes.email.toLowerCase() === searchKey.toLowerCase() ||
            e.attributes.external_id === searchKey ||
            e.attributes.id.toString() === searchKey.toString() ||
            e.attributes.first_name.toLowerCase() === searchKey.toLowerCase() ||
            e.attributes.last_name.toLowerCase() === searchKey.toLowerCase() ||
            e.attributes.uuid === searchKey
        );

        if (!user) { return await client.sendErrorEmbed(message.channel, "I was unable to find an account from your provided search key"); }

        user = user.attributes;

        await client.sendEmbed(message.channel, "Panel User Information", `
        **First Name**: ${user.first_name}
        **Language**: ${user.language}
        **Admin**: ${user.root_admin  ? "✅" : "❌"}

        **ID**: ${user.id}
        **ExternalID**: ${user.external_id ? user.external_id : "❌"}
        **2FA**: ${user["2fa"] ? "✅" : "❌"}

        **Created**: ${moment(new Date()).diff(user.created_at, 'days') + ' days ago'}
        **Last Updated**: ${moment(new Date()).diff(user.updated_at, 'days') + ' days ago'}
        `)


    });

    return;



}

module.exports.help = {
    name: "user",
    description: "Gets the defined user's panel data",
    dm: false,
    cooldown: 2,
    aliases: []
}