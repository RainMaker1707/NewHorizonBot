module.exports = {
  name: 'shut-up-mamat',
  value: "N/A",
  description: "Ferme sa gueule à Mamat",
  options: [
    { name: 'time-in-second', description: "temps en secondes pour que Mamat se taise", type: 4, required: true }
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}

