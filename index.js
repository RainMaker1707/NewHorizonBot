// Discord related import
const DS = require('discord.js');
const { Client, GatewayIntentBits, Partials} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


// External dependancies except discord related
const fs = require('node:fs');


// Internale dependancies
const CFG = require('./configs/config.json');
const SECRET = require('./configs/secret.json');


let bot = new Client({intents: [
                                GatewayIntentBits.DirectMessages, 
                                GatewayIntentBits.Guilds,
		                        GatewayIntentBits.GuildMessages,
                                GatewayIntentBits.MessageContent,
                                GatewayIntentBits.GuildMembers,
                                GatewayIntentBits.GuildMessageReactions,
                                GatewayIntentBits.DirectMessageReactions,
                                GatewayIntentBits.GuildVoiceStates,
                                GatewayIntentBits.GuildPresences
                            ],
                      partials: [Partials.Message, Partials.Channel, Partials.Reaction]
                    })


// Commands auto-loads from ./commands directory
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}


// Action the bot take just after login
bot.login(SECRET.token).then(async ()=> {
    console.log(bot, "Bot is now live");
})