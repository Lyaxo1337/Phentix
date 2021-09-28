import { Command } from "types/command"
import { MessageEmbed, Client} from "discord.js"

const say: Command = {
    config: {
        information: {
            name: "say", 
            description: "Send a message", 
            permLevel: "Bot Owner", 
            category: "system"
        }, 
        aliases: [""], 
        neededValues: [
            {
                valueName: "message", 
                index: 0, 
                joinTogether: true
            }, 
           
        ],
    },
    run: async(_client: Client, commandData) => {

    }
}

export default say;