const Discord = require("discord.js");

exports.run = async (client, message, args, guildConf, userConf) => {

    return client.sendEmbed(message.channel, "❌ Cancelled Orders", userConf.store.products.cancelled.length === 0 ? `You have no active orders at the moment.\n\`Do ${guildConf.prefix}store\` to purchase a plan` : ((userConf.store.products.active.map((p, index) => `**${index+1}**. ${p.title} - Price: $${p.price}`).join('\n'))),);

}

module.exports.help = {
    name: "cancelled",
    description: "Shows your cancelled orders",
    aliases: []
}
