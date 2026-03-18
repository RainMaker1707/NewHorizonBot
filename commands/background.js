const Discord = require('discord.js');


module.exports = {
  name: 'add-background',
  value: "N/A",
  description: "Ajoute un background à un joueur, si celui ci est présent dans la whitelsit",
  options: [
    { name: 'discord-id', description: "DiscordID du joueur (click droit sur son nom pour le récupérer, discord developer mode requis)", type: 3, required: true },
    { name: 'background', description: "Texte du background, pas de lien vers des documents svp!", type: 3, required: true }
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}