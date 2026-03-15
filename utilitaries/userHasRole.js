module.exports = {
    userHasRole: (interaction, roleList) => {
        return roleList.some(role => interaction.member.roles.cache.has(role));
    }
}