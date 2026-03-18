const Discord = require('discord.js');


module.exports = {
  name: 'warning',
  value: "N/A",
  description: "Envoit et enregistre un avertissement pour un joueur",
  options: [
    { name: 'discord-id', description: "DiscordID du joueur (click droit sur son nom pour le récupérer, discord developer mode requis)", type: 3, required: true },
    { name: 'steam-id', description: "Description de l'avertissement", type: 3, required: true }
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}