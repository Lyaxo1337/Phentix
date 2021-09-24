import { Client } from "discord.js"
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
            await Settings.updateOne({ _id: commandData.guild.id, "wildcards.trigger": { $ne: cmdTrigger } }, {
                $push: {
                wildcard: {
                    trigger: cmdTrigger,
                    commandInformation: commandInfo,
                }}
            })
            commandData.reply(`Created WC with the trigger: \`${cmdTrigger}\` and will initialize \`${commandInfo}\``)
            break; 
            case "delete": 
            
            break;
            case "search": 
            let input = <string>commandData.values.get("trigger")
            if(!input) return commandData.reply("Please include a trigger to search for!");
            let wildcard = _client.findWildcard(commandData.guild.id, input!.toString())
            await commandData.reply(`**Trigger**: ${wildcard[0].trigger} \n **Initializes**: ${wildcard[0].commandInformation}`)
            break;
            default: commandData.reply("Provide a value of `search`, `create`, or `delete`")
        }
    }
}

export default wildcard;