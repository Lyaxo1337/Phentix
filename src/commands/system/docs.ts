import axios from "axios"
import { Command } from "types/command"


const docs: Command = {
    config: {
        information: {
            name: "docs", 
            description: "search the discord.js docs for things", 
            permLevel: "Bot Owner", 
            category: "system"
        }, 
        aliases: ["search", "doc", "searchdocs"], 
        neededValues: [
            {
                valueName: "query", 
                joinTogether: true, 
                index: 0
            }
        ],
    }, 
    run: async(_client, commandData) => {
        const query = commandData.values.get("query");
        let emb = await axios("https://djsdocs.sorta.moe/v2/embed?src=master&q="+ query!.toString())
        await commandData.reply({embeds: [emb.data]})
        
    }

}
export default docs;
