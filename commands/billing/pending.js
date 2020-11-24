const Discord = require("discord.js");

exports.run = async (client, message, args, guildConf, userConf) => {

    return client.sendEmbed(message.channel, "⚠ Pending Orders", userConf.store.products.pending.length === 0 ? `You have no pending orders at the moment.\n\`Do ${guildConf.prefix}store\` to purchase a plan` : ((userConf.store.products.active.map((p, index) => `**${index+1}**. ${p.title} - Price: $${p.price}`).join('\n'))),);

}

module.exports.help = {
    name: "pending",
    description: "Shows your pending orders",
    aliases: []
}
