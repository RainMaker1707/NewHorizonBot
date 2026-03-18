module.exports = {
    sendMessage: (bot, channelId, message)=>{
            bot.channels.fetch(channelId)
        .then((chan)=>{
            chan.send(message)
        })

    }
} 