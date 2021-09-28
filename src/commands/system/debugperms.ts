import { Client, MessageEmbed} from "discord.js"
import { Command } from "types/command"
import { SettingsModel as Settings } from "../../../models/GuildSettings"
const permissions: Command = {
    config: {
        information: {
            name: "permlevel",
            description: "List, read, and set roles to permission levels",
            permLevel: "Bot Owner",
        },
        aliases: ["perm", "pl"],
        neededValues: [
            {
                valueName: "param", 
                index: 0, 
                joinTogether: false
            },
            {
                valueName: "role", 
                index: 1, 
                joinTogether: false, 
                allowFlags: true
            }, 
            {
                valueName: "permlevel", 
                index: 2, 
                joinTogether: false
            }
        ]
    },
    run: async (_client: Client, commandData) => {
        const parameter = commandData.values.get("param")
        let role;
        const permissionLevel = commandData.values.get('permlevel')
        switch(parameter) {
            case "add": 
            if(commandData.values.has("role")) {
                role = commandData.guild.roles.cache.get(
                    <string>commandData?.values?.get("role")?.toString()
                )
            } else {
                return commandData.reply("Provide a role id or ping a role!")
            }
            if(isNaN(permissionLevel)) return commandData.reply("Value `permlevel` must be a number.")
            if(permissionLevel > 10) return commandData.reply("Value `permlevel` must be under 10!")
            await Settings.updateOne(
                { _id: commandData.guild.id },
                {
                    $push: {
                        newRoles: {
                        name: role!.name,
                        id: role!.id,
                        level: permissionLevel,
                        },
                    },
                    }
                );
            commandData.reply(`I've added ${role?.name} to your permission levels! It is under index ${permissionLevel}`)
            break; 
            case "remove": 
            break; 
            case "search": 
            if(commandData?.flags?.has("index")) {
                if(isNaN(commandData?.flags?.get("index"))) return commandData.reply("Index must be a number!")
                let index = await _client.getInfoFromIndex(commandData.guild.id, commandData?.flags?.get("index"))
                if(index[0].name === "" && index[0].id === "") return commandData.reply("I can't find roles in this index. Are you sure roles are setup with it?")
                commandData.reply(`Found ${index.length} in ${commandData?.flags?.get("index")}.\n ${index.map(role => role.name).join('\n')}`)
            }
            if(commandData.values.has("role")) {
                role = commandData.guild.roles.cache.get(
                    <string>commandData?.values?.get("role")?.toString()
                )?.id || commandData.guild.roles.cache.find(r => r.name === commandData?.values.get("role")?.toString())?.id
                
            } else {
                return commandData.reply("Provide a role id or ping a role!")
            }
            let info = await _client.getPermissionLevelInfo(commandData.guild.id, role!.toString());
            if(info[0].name === "" && info[0].id === "") return commandData.reply("I can't find this roles information. Are you sure its setup?")
            commandData.reply(`Role Information: \nID: ${info[0].id}\nName: ${info[0].name}\nPermission Index: ${info[0].level}`)
            break; 
            case "list": 
            const embed = new MessageEmbed()
            .setTitle("Permission Levels")
            .setColor("RED")
            .setDescription(
                `${commandData.settings.newRoles
                    .map(role => `**Permission Level ${role.level}**\n\`${role.name}\`\n`)
                    .join("\t")}`
            );
            await commandData.reply({ embeds: [embed] });
            break;
            break;
        }
    }
}

export default permissions;