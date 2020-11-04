const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (client, message, args, guildConf, userConf) => {

    if (!client.isOwner(message)) { return; }

    let activities = message.guild.presences.cache.map(p => p.activities);
    let count = 0;


    (async function loop() {
        activities.forEach(a => {
            console.log(a[0])
            if (a.name === "BlueFox App") {
                count++;
            }
        })
    })();
    
    client.sendEmbed(message.channel, "BlueFox App", `${count} people are using **BlueFox App**`)

    return;
}

module.exports.help = {
    name: "bluefoxapp",
    description: "See how many people are using the bluefox app",
    dm: false,
    aliases: ["ba"]
}