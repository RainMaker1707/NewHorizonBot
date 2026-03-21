const CFG = require("../configs/config.json")

const userModel = require("../models/user_whitelist.json")

const { getDate } = require("../utilitaries/getDate")
const { userHasRole } = require("../utilitaries/userHasRole")
const { isWhitelist } = require("../utilitaries/whitelist")


module.exports = {
    whitelistCmd: async (interaction, DB) => {
        if(!userHasRole(interaction, CFG.WLAccessRolesList)){
            interaction.reply("You do not have enough access rights to make this action.")
            return
        }
        const discordID = interaction.options.getString("discord-id")
        const steamID = interaction.options.getString("steam-id")
        if(await isWhitelist(discordID, DB) || await isWhitelist(steamID, DB)){
            interaction.reply(`The user <@${discordID}> is already whitelisted with the record: ${JSON.stringify(record, null, 2)}`)
            return
        }
        userModel.steamId = steamID
        userModel.discordId = discordID
        userModel.staffId = interaction.user.toString()
        userModel.timestamp = getDate()
        DB.db(CFG.DBName).collection(CFG.WLTableName).insertOne(userModel).catch((err)=>{
            if(err) interaction.reply("Une erreur est survenue pendant la whitelist")
        }).then(()=>{
            // TODO: Automatic application of role whitelist
            member = interaction.guild.members.cache.get(discordID)
            if(!member){
                interaction.reply("An error occured during the role add. Do it manually!")
                return
            }
            member.roles.add(CFG.WLRole)
            interaction.reply(`User ${member.user.username}: ${member.user.globalName} has been whitelisted`)
        })
        console.log(`Whitelist command received with arguments: DiscordID: ${interaction.options.getString('discord-id')} - SteamID: ${interaction.options.getString('steam-id')}`)
    }
}