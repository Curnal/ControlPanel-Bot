module.exports = (client, guild) => {

    console.log(`The bot has been removed from: ${guild.name} (id: ${guild.id})`);
    client.serverDB.delete(guild.id);

};
