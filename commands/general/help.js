const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    if (args[0]) {
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));

        if (cmd) {
            await client.sendEmbed(message.channel, `Help`, `**Name**: ${cmd.help.name}\n**Description**: ${cmd.help.description}\n**DM**: ${cmd.help.dm}\n**Cooldown**: ${cmd.help.cooldown ? cmd.help.cooldown + " Seconds" : "None"}\n**Aliases**: ${cmd.help.aliases}`);
            return;
        } else {
            await client.sendErrorEmbed(message.channel, "That is not a valid command or alias")
            return;
        }
    }

    let embed = new Discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setTitle(`Bot Help`)
        .setFooter(client.config.embed.footer)
        .setTimestamp();

    embed.addField("General", `
    help, botstats, invite,
    ping, serverinfo, tutorial,
    userinfo, discordstatus`);

    embed.addField("Billing", `
    store, active, pending,
    suspended, cancelled`);

    embed.addField("Panel", `
    account, listservers, focus,
    info, start, stop, restart,
    nodes`)

    embed.addField("Staff", `
    setpanel, setapikey,
    eggs, locations, nests,
    setprefix`)

    if (client.isOwner(message)) {
        embed.addField("Owner", `
        eval, reload, servers,
        panels, startall, reload,
        load, unload, forcelink`)
    }

    await message.channel.send(embed);
    return;


}

module.exports.help = {
    name: "help",
    description: "Shows you all the commands",
    dm: true,
    aliases: ["h"]
}
