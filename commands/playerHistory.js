const Discord = require('discord.js');


module.exports = {
  name: 'player-history',
  value: "N/A",
  description: "Retourne l'historique d'avertissement d'un joueur",
  options: [
    { name: 'discord-id', description: "DiscordID du joueur (click droit sur son nom pour le récupérer, discord developer mode requis)", type: 3, required: true },
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}