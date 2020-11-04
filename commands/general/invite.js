const Discord = require('discord.js');

exports.run = async (client, message, args, guildConf, userConf) => {

    await client.sendEmbed(message.channel, `Invite me!`, `[Click-Here](https://discord.com/api/oauth2/authorize?client_id=758091636260733069&permissions=387136&scope=bot)`)

}

module.exports.help = {
    name: "invite",
    description: "Shows the bot invite link",
    dm: true,
    cooldown: 5,
    aliases: ["inv"]
}