// Discord related import
const DS = require('discord.js');
const { Client, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');


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


const rest = new REST({version: '10'}).setToken(SECRET.token);


// Commands auto-loads from ./commands directory
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

(async () => {
    try {
        console.log('Refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(CFG.clientId, CFG.guildId),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Actions the bot take just after login
bot.login(SECRET.token).then(async ()=> {
    console.log(`Bot is now live: ${bot.user.tag}`);
})

// Actions the bot take on interaction (/) command
bot.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const command = interaction.commandName;
    console.log(`Command received ${command} from ${interaction.user.displayName} id: ${interaction.user}`);
    switch(command){
        case "ping": try { interaction.reply("Pong! The bot is alive!"); } catch(err) {console.error(err)} break;
        case _: console.log("Not implement command error! (Should never happens)")
    }
})
