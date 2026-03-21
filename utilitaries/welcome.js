const CFG = require('../configs/config.json')
const SECRET = require('../configs/secret.json')
const { AttachmentBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

const WEBHOOK = new WebhookClient({'url': SECRET.WebHooks.Welcome})

const width = 1000 
const height = 300
const size = 256
const margin = (height - size) / 2
const textX = margin + size + 30


async function generateWelcomeImage (user){
    const sharp = require('sharp')
    const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 512 })
    const avatarBuffer = await fetch(avatarUrl).then(res => res.arrayBuffer())

    const svgTemplate = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="#18191c"/>
                            
                            <defs>
                                <clipPath id="circleView">
                                    <circle cx="${margin+size/2}" cy="${margin+size/2}" r="${size/2}" />
                                </clipPath>
                            </defs>
                            <image x="${margin}" y="${margin}" width="${size}" height="${size}" href="data:image/png;base64,${Buffer.from(avatarBuffer).toString('base64')}" clip-path="url(#circleView)"/>

                            <text x="${textX}" y="110" font-family="'Whitney', 'gg sans', sans-serif" font-size="78" font-weight="bold" fill="white">BIENVENUE</text>
                            <text x="${textX}" y="170" font-family="'Whitney', 'gg sans', sans-serif" font-size="42" fill="#b9bbbe">sur le serveur Discord</text>
                            <text x="${textX}" y="230" font-family="'Whitney', 'gg sans', sans-serif" font-size="48" font-weight="bold" fill="white">NEW HORIZON ROLEPLAY</text>
                        </svg>`

    // Conversion SVG -> PNG avec Sharp
    const buffer = await sharp(Buffer.from(svgTemplate)).png().toBuffer();
    
    return new AttachmentBuilder(buffer, { name: 'welcome.png' });
}

module.exports = {
    welcomeEmbed: async (user)=>{
        const welcomeMessage = `🎉Bienvenue ${user} sur le serveur **New Horizon RP**🎉!\n\n` +
                                `Je t'invite à te diriger vers <#${CFG.Channels.Rules}>, <#${CFG.Channels.RPRules}> puis vers <#${CFG.Channels.Lore}>.\n\n` +
                                `Tu pourras ensuite ouvrir ton ticket dans <#${CFG.Channels.CreateTicket}> pour accéder à la Whitelist.`
        const attachment = await generateWelcomeImage(user)
        const embed = new EmbedBuilder()
                .setColor(CFG.WelcomeColor)
                .setTitle(CFG.WelcomeMessageTitle)
                .setDescription(welcomeMessage)
                .setImage(`attachment://${attachment.name}`)  
        console.log("Embed build correctly")
        WEBHOOK.send({
                    username: CFG.BotUsername,
                    embeds: [embed],
                    files: [attachment]
                })
        }
}