const { Client, RichEmbed, SnowflakeUtil } = require("discord.js")
const client = new Client()
const cfg = require("./cfg")

class GeisterEmbed extends RichEmbed {
    constructor() {
        super()
        this.color = new cfg.color().generatedColor
    }
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

client.on('message', async (message) => {
    if (!message.guild || message.author.bot || !message.content.startsWith(cfg.prefix)) return

    const args = message.content.split(/ +/).slice(1)
    const command = message.content.split(/ +/)[0].substr(cfg.prefix.length)

    if (command === "pin") {
        if (!args[0] || !message.author.id === "299556333097844736") return

        message.channel.fetchMessages({ limit: 100 })

        const msg = await message.channel.fetchMessage(args[0])
        let attachments = ""
        for (let attachment of msg.attachments) {
            attachments += "[Anhang](" + attachment[1].url + ")\n"
        }
        const embedPin = new GeisterEmbed()
            .setTitle("<:gg_pin:597485983910461472> " + msg.member.displayName)
            .setDescription(msg.content + `\n\n${attachments}[Original](https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
        client.channels.get(cfg.pinChannel).send(embedPin)
        const m = await message.channel.send("<:gg_pin:597485983910461472>")
        setTimeout(() => {
            m.delete()
        }, 5000);
    } else if (command === "help") {
        message.channel.send("Geheim! Aber ich bin Open-Source: https://github.com/spVierSechs/geistergangbot")
    } else if (command === "eval") {
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "js" });
        } catch (err) {
            message.channel.send(`Hmm, \`\`\`js\n${clean(err)}\n\`\`\``);
        }
    } else if (command === "geist") {
        try {
            message.member.removeRole("540856179195379723")
            message.member.addRole("540856027407450112")
            message.reply("Willkommen zum Geister-Clan.")
        } catch(e) {
            message.reply("Ein Fehler ist aufgetreten. Bist du bereits Geist?")
            message.channel.send(e, {code:"js",split:true})
        }
        
    }
})

client.once('ready', () => {
    console.log("Ready!")
})

client.login(cfg.token)