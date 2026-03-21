const CFG = require("../configs/config.json")
const SECRET = require('../configs/secret.json')
const { EmbedBuilder, WebhookClient } = require('discord.js');
const { obfuscateMessage } = require("./transmission");

const WEBHOOK = new WebhookClient({'url': SECRET.WebHooks.Transmission})


module.exports = {
    sendMessage: (bot, channelId, message)=>{
            bot.channels.fetch(channelId)
        .then((chan)=>{
            chan.send(message)
        })
    },
    sendEmbed: (bot, message)=>{
        embed = new EmbedBuilder()
                .setColor(CFG.TransmissionColor)
                .setDescription("\"*" + obfuscateMessage(message.content) +"*\"")
        WEBHOOK.send({
                    username: 'ChRN - RadioKanal',
                    embeds: [embed]
                }).then(msg => setTimeout(()=> {
                    bot.channels.fetch(CFG.Channels.Transmission).then((chan)=>{try{chan.messages.delete(msg.id)}catch(err){console.log("ERROR DELETING TRANSMISSION:\n" + err)}})
                }, CFG.TransmissionMinutesTTL*60000))
    }
} 