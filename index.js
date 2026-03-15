// Discord related import
const { Client, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');


// External dependancies except discord related
const { readdirSync } = require('fs');
const { MongoClient } = require('mongodb');


// Internale dependancies
const SECRET =  require('./configs/secret.json');
const { switchCommand } = require('./libs/commandSwitch');


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
const DB = new MongoClient('mongodb://127.0.0.1:27017')


// Commands auto-loads from ./commands directory
const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

(async () => {
    try {
        console.log('Refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(SECRET.clientId, SECRET.guildId),
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
    switchCommand(command, bot, interaction, DB, ()=>{ 
        console.log(`Switch for command ${command} has been run succcesfully for ${interaction.user.displayName}: ${interaction.user}`) 
    });
})
