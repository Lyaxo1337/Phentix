import { Command } from "types/command" 
import { Client } from "discord.js"


const ban: Command = {
    config: {
        information: {
            name: "ban", 
            description: "Ban a member from the guild", 
            category: "moderation", 
            permLevel: "ADMINISTRATOR", 
        },
        aliases: ["yeet"], 
        neededValues: [
            {
                valueName: "user", 
                joinTogether: false, 
                index: 0
            }, 
            {
                valueName: "time", 
                joinTogether: false, 
                index: 1
            },
            {
                valueName: "reason", 
                joinTogether: true, 
                index: 2
            }
        ],
    }, 
    run: async(_client: Client, commandData) => {
        let user = commandData.guild.members.cache.get(
            <string>commandData?.values?.get("user")?.toString()
        );
        let time = commandData.values.get("time");
        let reason = commandData.values.get("reason")
        if(!user) return commandData.reply(`Cannot resolve ${user} to a guild member`)
        if(!user?.bannable) return commandData.reply("This user cannot be banned!")
        user.ban({reason: reason?.toString(), })
        
    }
}

export default ban;