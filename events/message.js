module.exports = async (client, message) => {

    if (message.author.bot) return;

    if (message.guild) {
        client.log("guildMessage", `[Guild: ${message.guild.name}] [Channel: "${message.channel.name}"] [User: "${message.author.username}#${message.author.discriminator}"]: "${message.content || JSON.stringify(message.embeds)}"`)
    } else {
        client.log("directMessage", `[User: ${message.author.username}#${message.author.discriminator}]: "${message.content}"`)
    }

    let args;
    let guildConf;
    let userConf;

    if (message.guild) {

        guildConf = client.serverDB.ensure(message.guild.id, client.defaultServerDB);

        userConf = client.userDB.ensure(`${message.author.id}-${message.guild.id}`, {
            guild: message.guild.id,
            user: message.author.id,
            cooldowns: {},
            panel: {
                focused: null,
                apiKey: null,
                data: {},
                servers: []
            },
            store: {
                balance: 0,
                payments: [],
                paymentMethods: [],
                products: {
                    active: [],
                    pending: [],
                    suspended: [],
                    cancelled: []
                }
            },
            boosting: {
                isBoosting: false,

            },
            lastSeen: Date.now()
        });

        if (message.content.indexOf(guildConf.prefix) !== 0) return;
        args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);

    } else {

        if (message.content.indexOf(client.config.dmPrefix) !== 0) return;
        args = message.content.slice(client.config.dmPrefix.length).trim().split(/ +/g);

    }

    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (client.config.deleteMessage) await message.delete();
    if (!cmd) return;

    if (!message.guild && !cmd.help.dm) return client.sendEmbed(message.channel, "You may only use that command in servers!");

    if (cmd.help.cooldown != null) {
        if (client.hasCooldown(message.author.id, message.guild.id, cmd.help.name)) {
            return message.react("⏰");
        } else {
            client.addCooldown(message.author.id, message.guild.id, cmd.help.name, cmd.help.cooldown);
        }
    }

    if (cmd.help.staff != null) {
        if (!message.member.hasPermission("ADMINISTRATOR") && !client.isOwner(message)) {
            return client.sendErrorEmbed(message.channel, `Missing: ADMINISTRATOR`);
        }
    }

    if (cmd.help.owner != null) {
        if (!client.isOwner(message)) {
            return client.sendErrorEmbed(message.channel, `Missing: OWNER`);
        }
    }

    if (message.guild) {

        try {
            cmd.run(client, message, args, guildConf, userConf);
            console.log("command", `[Guild: ${message.guild.name}] [Channel: "${message.channel.name}"] [User: "${message.author.username}#${message.author.discriminator}"]: "${message.content || JSON.stringify(message.embeds)}"`);
            client.serverDB.inc(message.guild.id, "commandsRun");
        } catch (e) {
            client.error(4, `Could not run command "${cmd}"\n${e}`);
            await client.sendErrorEmbed(message.channel, "An unknown error has occurred.\nReport this to: FlaringPhoenix#0001");
            return;
        }

    } else {

        try {
            cmd.run(client, message, args);
            console.log("command", `[DMS] [User: "${message.author.username}#${message.author.discriminator}"]: "${message.content || JSON.stringify(message.embeds)}"`);
            return;
        } catch (e) {
            client.error(4, `Could not run command "${cmd}"\n${e}`);
            await client.sendErrorEmbed(message.author, "An unknown error has occurred.\nReport this to: FlaringPhoenix#0001");
            return;
        }

    }

    return;

};
