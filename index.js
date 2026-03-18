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
const { sendMessage } = require("./utilitaries/sendMessage");
const { isWhitelist } = require('./utilitaries/whitelist');
const { obfuscateMessage, filterMessage } = require("./utilitaries/transmission")
const { statusUpdater } = require("./utilitaries/tools")


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
const WEBHOOK = new WebhookClient({url: SECRET.WebHookURL})


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
    
    
    //send a message for topserveur votes in discussion channel hrp
    //sendMessage(bot, CFG.VoteChannel, CFG.VoteMessage)
    setInterval(()=>{
        console.log("Entered interval")
        sendMessage(bot, CFG.VoteChannel, CFG.VoteMessage)
    }, 3600000) //  ms interval => 1h

    setInterval(() => statusUpdater(bot), 5000)
})


// Actions the bot take on interaction (/) command
bot.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const command = interaction.commandName;
    console.log(`Command received ${command} from ${interaction.user.displayName} id: ${interaction.user}`);
    switchCommand(command, interaction, DB, ()=>{ 
        console.log(`Switch for command ${command} has been run succcesfully for ${interaction.user.displayName}: ${interaction.user}`) 
    });
})

bot.on('messageCreate', async (message) => {
    if (message.author.username === CFG.BotUsername) return;
    if(!message.guild){
        if(isWhitelist(message.author.id, DB) && filterMessage(message.content)){
            embed = new DS.EmbedBuilder()
                    .setColor(CFG.TransmissionColor)
                    .setDescription("\"*" + obfuscateMessage(message.content) +"*\"")
                    WEBHOOK.send({
                                username: 'ChRN - RadioKanal',
                                embeds: [embed]
                            }).then(msg => setTimeout(()=> {
                                bot.channels.fetch(CFG.TransmissionChannel).then((chan)=>{try{chan.messages.delete(msg.id)}catch(err){console.log("ERROR DELETING TRANSMISSION:\n" + err)}})
                            }, CFG.TransmissionMinutesTTL*60000))
            message.reply("Transmission sent!")
        } else {
            message.reply("You're not whitelisted on New Horizon Roleplay server or tried to send a banned word!")
        }
    }
})
