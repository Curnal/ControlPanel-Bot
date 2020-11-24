const Discord = require("discord.js");

exports.run = async (client, message, args, guildConf, userConf) => {

    return client.sendEmbed(message.channel, "🛑 Suspended Orders", userConf.store.products.suspended.length === 0 ? `You have no active orders at the moment.\n\`Do ${guildConf.prefix}store\` to purchase a plan` : ((userConf.store.products.active.map((p, index) => `**${index+1}**. ${p.title} - Price: $${p.price}`).join('\n'))),);

}

module.exports.help = {
    name: "suspended",
    description: "Shows your suspended orders",
    aliases: []
}
