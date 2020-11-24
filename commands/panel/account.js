const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = guildConf.panel.apiKey;

    if (!panel) return client.sendErrorEmbed(message.channel, "No panel has been setup!");
    if (!key) return client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!account link API-KEY");

    let option = args[0];

    switch (option) {
        case "signup": {
            if (Object.keys(userConf.panel.data).length != 0) return client.sendErrorEmbed(message.channel, "You already have an account");

            let username = args[1];
            if (!username) return client.sendErrorEmbed(message.channel, "Please provide a username");

            let email = args[2];
            if (!email) return client.sendErrorEmbed(message.channel, "Please provide an email");

            let EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!EMAIL_REGEX.test(email)) return client.sendErrorEmbed(message.channel, "Please provide a valid email")

            let password = client.generatePassword(10);
            const data = {
                username: username,
                email: email,
                first_name: username,
                last_name: username,
                password: password,
                root_admin: false,
                language: "en"
            }

            request.post(`${panel}/api/application/users`, {
                auth: {
                    bearer: key
                },
                json: data
            }, async function(err, response, body) {

                let errors = response.body.errors;
                if (errors && errors.length > 0) return client.sendErrorEmbed(message.channel, errors[0].detail);

                if (err) return client.sendErrorEmbed(message.channel, "An error has occured");
                if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

                client.userDB.set(`${message.author.id}-${message.guild.id}`, response.body.attributes, "panel.data");

                await client.sendEmbed(message.channel, `Your account has been created!`, "Check your dms");
                await client.sendEmbed(message.author, `Account Details`, `**Username**: ${username}\n**Email**: ${email}\n**Password**: ${password}`);

            });

            return;

        }
        case "link": {

            let userKey = args[1];
            if (!userKey) return client.sendErrorEmbed(message.channel, "You must provide your api key from the panel");

            message.delete();

            request.get(`${panel}/api/client`, {
                auth: {
                    bearer: userKey
                }
            }, async function(err, response, body) {

                if (err) return client.sendErrorEmbed(message.channel, "An error has occured!");
                if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

                client.userDB.set(`${message.author.id}-${message.guild.id}`, userKey, "panel.apiKey");
                return client.sendEmbed(message.channel, "Your account has been linked!");

            });

            return;
        }
        case "info": {
            if (Object.keys(userConf.panel.data).length === 0) return client.sendErrorEmbed(message.channel, `You must signup\n${guildConf.prefix}account signup`);

            let user = userConf.panel.data;
            return client.sendEmbed(message.channel, "Panel User", `
**First Name**: ${user.first_name}
**Language**: ${user.language}
**Admin**: ${user.root_admin ? "✅" : "❌"}

**ID**: ${user.id}
**ExternalID**: ${user.external_id ? user.external_id : "❌"}
**2FA**: ${user["2fa"] ? "✅" : "❌"}

**Created**: ${moment(new Date()).diff(user.created_at, 'days') + ' days ago'}
**Last Updated**: ${moment(new Date()).diff(user.updated_at, 'days') + ' days ago'}

`)
        }
        case "reset": {
            if (Object.keys(userConf.panel.data).length === 0) return client.sendErrorEmbed(message.channel, `You must signup\n${guildConf.prefix}account signup`);

            let password = client.generatePassword(10);
            let user = userConf.panel.data;

            let data = {
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                password: password
            }

            request.patch(`${panel}/api/application/users/${user.id}`, {
                auth: {
                    bearer: key
                },
                json: data
            }, async function(err, response, body) {

                let errors = response.body.errors;
                console.log(errors);
                if (errors && errors.length > 0) return client.sendErrorEmbed(message.channel, errors[0].detail);

                if (err) return client.sendErrorEmbed(message.channel, "An error has occured");
                if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

                client.userDB.set(`${message.author.id}-${message.guild.id}`, response.body.attributes, "panel.data");

                await client.sendEmbed(message.channel, `Your password has been reset!`, "Check your dms");
                await client.sendEmbed(message.author, `Account New Password`, password);

            });

            return;
        }
    }

    return client.sendEmbed(message.channel, "Invalid argument", "\`\`\`signup, link, info, reset\`\`\`")

}

module.exports.help = {
    name: "account",
    description: "Manage your account on the panel",
    dm: false,
    aliases: ["acc"]
}
