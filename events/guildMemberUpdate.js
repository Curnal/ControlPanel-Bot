module.exports = async (client, oldMember, newMember) => {

    if (oldMember.premiumSince === null) {
        if (newMember.premiumSince != null) {
            // DO SOMETHING
            let guildConf = client.serverDB.get(oldMember.guild.id);
        }
    }

};
