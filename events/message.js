module.exports = async (client, message) => {

    if (message.author.bot) return;

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

    if (message.guild) {

        try {
            cmd.run(client, message, args, guildConf, userConf);
            console.log(`COMMAND - ${message.author.tag} (${message.author.id}) ran "${message.content}" in "${message.guild.name}" (${message.guild.id})`);
            client.serverDB.set(message.guild.id, (guildConf.commandsRun+1), "commandsRun");
        } catch (e) {
            console.error(e);
            return;
        }

    } else {

        try {
            cmd.run(client, message, args);
            console.log(`COMMAND - ${message.author.tag} (${message.author.id}) ran "${message.content}" in their DMS`)
        } catch (e) {
            console.error(e);
            return;
        }

    }

    return;

};
