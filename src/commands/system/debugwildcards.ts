import { Client, MessageEmbed } from "discord.js"
import { Command } from "types/command"
import { SettingsModel as Settings } from "../../../models/GuildSettings"

const wildcard: Command = {
    config: {
        information: {
            name: "wildcard", 
            description: "create and debug wildcards", 
            permLevel: "Bot Owner"
        }, 
        neededValues: [
            {
                valueName: "param", 
                index: 0, 
                joinTogether: false
            }, 
            {
                valueName: "trigger", 
                index: 1, 
                joinTogether: false
            }, 
            {
                valueName: "init", 
                index: 2, 
                joinTogether: false
            }
        ],
        aliases: ["wc"]
    }, 
    run: async (_client: Client, commandData)  => {
        let parameter = commandData.values.get("param")?.toString();
        switch(parameter) {
            case "create": 
            let cmdTrigger = commandData.values.get("trigger")
            let commandInfo = commandData.values.get("init")
            if(!cmdTrigger) return commandData.reply("Provide a trigger for the wildcard!")
            if(!commandInfo) return commandData.reply("Please include what command you want to initialize!")
            if(commandData.settings.wildcards.find(wc => wc.trigger === cmdTrigger)) return commandData.reply(`A command with the trigger ${cmdTrigger} already exists!`)
            await Settings.updateOne({_id: commandData.guild.id}, {
                $push: {
                    wildcards: {
                        trigger: cmdTrigger, 
                        commandInformation: commandInfo,
                    }
                }
            })
            commandData.reply(`Created WC with the trigger: \`${cmdTrigger}\` and will initialize \`${commandInfo}\``)
            break; 
            case "delete": 
            Settings.deleteOne()
            
            commandData.reply(`Deleted wildcard ${inp!.toString()}`)
            break;
            case "search": 
            let input = commandData.values.get("trigger")
            if(!input) return commandData.reply("Please include a trigger to search for!");
            let wildcard = await _client.findWildcard(commandData.guild.id, input!.toString())
            if(wildcard[0] == null || wildcard[0] == undefined) return commandData.reply("I can't find this wildcard, are you sure it exists?")
            await commandData.reply(`**Trigger**: ${wildcard[0].trigger} \n **Initializes**: ${wildcard[0].commandInformation}`)
            break;
            case "list":
            const embed = new MessageEmbed()
            .setTitle("Wildcards")
            .setDescription(`${commandData.settings.wildcards.map(wc => `\`${wc.trigger}\``).join(' ')}`)
            commandData.reply({embeds:[embed]})
            break;
            default: commandData.reply("Provide a value of `search`, `create`, or `delete`")
        }
    }
}

export default wildcard;