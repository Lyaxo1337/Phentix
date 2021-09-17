import { Command } from "types/command";
import { MessageEmbed } from "discord.js";

const run: Command = {
  config: {
    information: {
      name: "run",
      description: "command to run javascript through the bot",
      permLevel: "Bot Owner",
      category: "system",
    },
    neededValues: [
      {
        valueName: "code",
        joinTogether: true,
        index: 0,
      },
    ],
    aliases: ["eval"],
  },
  run: async (client, commandData) => {
    const inp = commandData.values.get("code");
    try {
      // Eval the code
      let e = await eval(inp!.toString());

      if (typeof e == "object") {
        e = JSON.stringify(e);
      } else {
        e = <string>e;
      }
      commandData.channel!.send({
        embeds: [
          new MessageEmbed()
            .setTitle("E V A L")
            .setColor("PURPLE")
            .addField("INPUT", `\`\`\`js\n${inp}\`\`\``)
            .addField("OUTPUT", `\`\`\`${e}\`\`\``),
        ],
      });
    } catch (e) {
      commandData.channel?.send({
        embeds: [new MessageEmbed().setTitle("Error").setDescription(`\`\`\`${e}\`\`\``)],
      });
      console.log(e);
    }
  },
};

export default run;
