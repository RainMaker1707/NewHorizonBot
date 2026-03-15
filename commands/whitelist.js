const Discord = require('discord.js');


module.exports = {
  name: 'whitelist',
  value: "N/A",
  description: "WhiteList un joueur dans la DB",
  options: [
    { name: 'steam-id', description: "SteamID du joueur", type: 3, required: true },
    { name: 'discord-id', description: "DiscordID du joueur (click droit sur son nom pour le récupérer)", type: 3, required: true }
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}