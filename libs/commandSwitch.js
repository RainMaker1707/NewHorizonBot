const { whitelistCmd } =  require('./whitelist');
const { background, getBackground } = require("./background");
const { warning, playerHistory } = require("./warning")
const { shutUpMamat } = require('./shut-up-mamat.js')

module.exports = {
    switchCommand: async (command, interaction, DB, callback) => {
        switch(command){
            // Keep this alphabetically sorted
            case "background": try { background(interaction, DB) } catch(err) { console.log(err) } break;
            case "get-background": try { getBackground(interaction, DB) } catch(err) { console.log(err) } break;
            case "ping": try { interaction.reply("Pong! The bot is alive!"); } catch(err) { console.error(err); } break;
            case "player-history": try { playerHistory(interaction, DB) } catch(err) { console.log(err) } break;
            case "shut-up-mamat": try { await shutUpMamat(interaction) } catch(err) { console.log(err) } break;
            case "warning": try { warning(interaction, DB) } catch(err) { console.log(err) } break;
            case "whitelist": try { await whitelistCmd(interaction , DB); } catch(err) { console.error(err); } break;
            default: console.log("Not implement command error! (Should never happens)")
        }
        try{
            callback()
        } catch(err){
            console.error("Agument *callback* was not runnable or an uncatched error occured at runtime!")
        }
    }
}