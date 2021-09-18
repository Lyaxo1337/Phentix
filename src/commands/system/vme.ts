import { Command } from "types/command";
import { MessageEmbed } from "discord.js";
import { exec } from "child_process"
const vme: Command = {
    config: {
        information: {
            name: "vme", 
            description: "uwu run thing in da console-wonsole OwO", 
            permLevel: "Bot Owner", 
            category: "system"
        }, 
        aliases: ["vm", "virtualmachine", "virtualmachineeval"], 
        neededValues: [
            {
                valueName: "value", 
                joinTogether: true, 
                index: 0
            }
        ]
    }, 
    run: async(_client, commandData) => {
        try {
            const inp = commandData.values.get("value");
            exec(inp!.toString(), (e, out, err) => {
                let embed = new MessageEmbed()
                .setDescription(`\`\`\`${out}${err ? `\n ${err}` : ""}\`\`\``)
                commandData.reply({embeds: [embed]})
            });
        } catch (e) {
            commandData.reply("Message too long.");
        }
    }
}

export default vme;