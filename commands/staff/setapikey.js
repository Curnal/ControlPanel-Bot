const discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR") && !client.isOwner(message)) {return await client.sendErrorEmbed(message.channel, `Insufficient Permissions`);}

    await message.delete();
    let key = args[0];

    if (!key) {return await client.sendErrorEmbed(message.channel, `You must provide an api key`);}

    // let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    // let regex = new RegExp(expression);
    //
    // if (!url.match(regex)) {return await client.sendErrorEmbed(message.channel, `You must provide a valid url`);}

    client.serverDB.set(message.guild.id, key, "panel.apiKey");
    await client.sendEmbed(message.channel, "Panel API Key Saved!");

    return;

}

module.exports.help = {
    name: "setpanel",
    aliases: ["sp"]
}