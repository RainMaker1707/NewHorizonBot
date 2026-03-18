const Discord = require('discord.js');


module.exports = {
  name: 'get-background',
  value: "N/A",
  description: "Renvoit le background du joueur si un background est enregistré",
  options: [
    { name: 'discord-id', description: "DiscordID du joueur (click droit sur son nom pour le récupérer, discord developer mode requis)", type: 3, required: true },
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}