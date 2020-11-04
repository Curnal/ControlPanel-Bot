const Discord = require("discord.js");

exports.run = async (client, message, args, guildConf, userConf) => {

    if (!message.member.hasPermission("ADMINISTRATOR") && !client.isOwner(message)) { return await client.sendErrorEmbed(message.channel, `Insufficient Permissions`); }
    if (!args[0]) {return client.sendErrorEmbed(message.channel, `Please provide a prefix`)}

    client.serverDB.set(message.guild.id, args[0], "prefix")
    return client.sendEmbed(message.channel, `Success!`, `**Prefix** has been saved in the database.`);

}

module.exports.help = {
    name: "setprefix",
    description: "Sets the current guilds prefix",
    dm: true,
    aliases: ["sp"]
}