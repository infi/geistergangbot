const { Client, RichEmbed, SnowflakeUtil } = require("discord.js")
const client = new Client()
const cfg = require("./cfg") || require("./cfg_E")

class GeisterEmbed extends RichEmbed {
    constructor() {
        super()
        this.color = new cfg.color().generatedColor
    }
}

client.on('message', async (message) => {
    if (!message.guild || message.author.bot || !message.content.startsWith(cfg.prefix)) return

    const args = message.content.split(/ +/).slice(1)
    const command = message.content.split(/ +/)[0].substr(cfg.prefix.length)

    if (command === "pin") {
        if (!args[0] || !message.author.id === "299556333097844736") return

        message.channel.fetchMessages({ limit: 100 })

        var msg = await message.channel.fetchMessage(args[0])
        var attachments = ""
        var i = 0
        for (let attachment of msg.attachments) {
            ++i
            attachments += "\n[Anhang](" + attachment[1].url + ")"
        }
        var embedPin = new GeisterEmbed()
            .setTitle("<:gg_pin:597485983910461472> " + msg.member.displayName)
            .setDescription(msg.content + `\n\n${attachments}\n[Original](https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
        client.channels.get(cfg.pinChannel).send(embedPin)
        var m = await message.channel.send("<:gg_pin:597485983910461472>")
        // message.channel.send(embedPin)
        setTimeout(() => {
            m.delete()
        }, 5000);
    }
})

client.once('ready', () => {
    console.log("Ready!")
})

client.login(cfg.token)