// Discord related import
const DS = require('discord.js');
const { Client, GatewayIntentBits, Partials, REST, Routes, WebhookClient} = require('discord.js');


// External dependancies except discord related
const { readdirSync } = require('fs');
const { MongoClient } = require('mongodb');


// Internale dependancies
const SECRET =  require('./configs/secret.json');
const CFG = require("./configs/config.json")
const { switchCommand } = require('./libs/commandSwitch');
const { sendMessage, sendEmbed } = require("./utilitaries/sendMessage");
const { isWhitelist } = require('./utilitaries/whitelist');
const { obfuscateMessage, filterMessage } = require("./utilitaries/transmission")
const { statusUpdater } = require("./utilitaries/tools");
const { welcomeEmbed } = require('./utilitaries/welcome');


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
const DB = new MongoClient(CFG.MongoDBURL)


// Commands auto-loads from ./commands directory
const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log("Reloaded: " + command.name)
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
    
    //send a message for topserveur votes in discussion channel hrp
    //sendMessage(bot, CFG.Channels.Vote, CFG.VoteMessage)
    setInterval(()=>{
        console.log("Entered interval")
        sendMessage(bot, CFG.Channels.Vote, CFG.VoteMessage)
    }, 3600000) //  ms interval => 1h

    setInterval(() => statusUpdater(bot), 5000)
})


// Actions the bot take on interaction (/) command
bot.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const command = interaction.commandName;
    console.log(`Command received ${command} from ${interaction.user.displayName} id: ${interaction.user}`);
    if(!commands.find(cmd => cmd.name === command)) {
        console.log("No command found")
        return;
    }
    await switchCommand(command, interaction, DB, ()=>{ 
        console.log(`Switch for command ${command} has been run succcesfully for ${interaction.user.displayName}: ${interaction.user}`) 
    });
})


bot.on('messageCreate', async (message) => {
    if (message.author.username === CFG.BotUsername) return;
    if(!message.guild){
        if(await isWhitelist(message.author.id, DB) && filterMessage(message.content)){
            sendEmbed(bot, message)
            message.reply("Transmission sent!")
        } else {
            // TODO split error message to better handle errors
            message.reply("You're not whitelisted on New Horizon Roleplay server or tried to send a banned word!")
        }
    } else if (message.channel.parentId == CFG.Categories.Logs) return;
    else {
        console.log("Received message but dropped: " + message + " Content: " + message.content + " Author: " + message.author.id)
    }
})

bot.on('guildMemberAdd', async (user)=>{
    console.log(`Member joined: ${user}`)
    // Bypass for RainMaker leave and come back instant get DEV role
    if(user.id == "242402612601815040"){
        guild = bot.guilds.cache.get(CFG.GuildId)
        if(!guild){
            console.log("No guild found")
            return
        }
        member = bot.guilds.cache.get(CFG.GuildId).members.cache.get(user.id)
        if(!member){
            console.log("No member found")
            return
        }
        await member.roles.add("1326184088037625917") //Dev role

        await welcomeEmbed(user)
    }
})
