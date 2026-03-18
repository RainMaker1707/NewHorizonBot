const CFG = require("../configs/config.json")

const fs = require('fs');
const DS = require('discord.js')

module.exports = {
    getRandomInt: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    statusUpdater: (bot)=>{
        // here count number of line in online.txt
        fs.readFile(CFG.DayZOnlinePath, 'utf-8', (err, data)=>{
            if (err) log(bot, err)
            else {
                let count = 0
                for(let i = 0; i < data.length; i++){
                    if ( data[i] == "\n") count ++
                }
                bot.user.setPresence({
                    activities:[{
                        type: DS.ActivityType.Watching,
                        name: `${count} joueurs en ligne` // here is the real status string
                    }],
                    status: ""
                })
            }
        })
    }
}