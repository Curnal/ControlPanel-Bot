const Discord = require('discord.js');

exports.run = async (client, message, args, guildConf, userConf) => {

    await client.sendEmbed(message.channel, `Tutorial`, `
    __Hosting Company__:
    - cp!setpanel https://panel.host.com
    > Sets the panel url
    > for all commands

    - cp!setapikey <API-KEY>
    > Sets the application api
    > key for staff commands

    __Personal Use__:
    - cp!setpanel https://panel.host.com
    > Sets the panel url
    > for all commands
    
    __Both__:
    - cp!link <API-KEY>
    > Links your discord
    > account with the panel
    `)

}

module.exports.help = {
    name: "tutorial",
    description: "Shows a basic tutorial of the bot's functionality",
    dm: true,
    cooldown: 2,
    aliases: []
}