const { whitelistCmd } =  require('./whitelist');

module.exports = {
    switchCommand: (command, bot, interaction, DB, callback) => {
        switch(command){
            case "ping": try { interaction.reply("Pong! The bot is alive!"); } catch(err) { console.error(err); } break;
            case "whitelist": try { whitelistCmd(bot, interaction , DB); } catch(err) { console.error(err); } break;
            case _: console.log("Not implement command error! (Should never happens)")
        }
        try{
            callback()
        } catch(err){
            console.error("Agument *callback* was not runnable or an uncatched error occured at runtime!")
        }
    }
}