const CFG = require('../configs/config.json')

module.exports = {
    shutUpMamat: async (interaction) => {
        const timeInMs = (await interaction.options.getInteger("time-in-second")) * 1000
        const mamat = await interaction.guild.members.cache.get(CFG.MamatId)
        await mamat.roles.remove(CFG.AdminRole)
                .then(()=>console.log("Mamat's admin role removed"))
                .catch((err)=>console.log(err))
        
        await mamat.timeout(timeInMs, "Tais toi un peu!")
                .then(()=>console.log("Timeout ran"))
                .catch((err)=>console.log(err))

        setTimeout(async () => {
            await mamat.roles.add(CFG.AdminRole)
                    .then(()=>console.error("Role admin rendu"))
                    .catch((err)=>console.log("Impossible de rendre les rôles :", err))
        }, timeInMs)
        interaction.reply("Eheh, enfin tranquil!")
    }
}