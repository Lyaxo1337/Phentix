import { Command } from "types/command";
import { MessageEmbed } from "discord.js";

const run: Command = {
  config: {
    information: {
      name: "system",
      description: "commands only the bot owner's can use.",
      permLevel: "Bot Owner",
      category: "system",
    },
    neededValues: [
      {
        valueName: "group",
        joinTogether: false,
        index: 0,
      },
      {
        valueName: "type",
        joinTogether: false,
        index: 1,
      },
      {
        valueName: "value",
        joinTogether: true,
        index: 2,
      },
    ],
    aliases: ["eval"],
  },
  run: async (_client, commandData) => {
    console.log(commandData.values);
    if (
      commandData.values.get("group")?.toString() === "debug" &&
      commandData.values.get("type")?.toString() === "eval"
    ) {
      const inp = commandData.values.get("value");
      try {
        // Eval the code
        let e = await eval(inp!.toString());

        if (typeof e == "object") {
          e = JSON.stringify(e);
        } else {
          e = <string>e;
        }
        commandData.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("E V A L")
              .setColor("PURPLE")
              .addField("INPUT", `\`\`\`js\n${inp}\`\`\``)
              .addField("OUTPUT", `\`\`\`js\n${e}\`\`\``)
          ],
        });
      } catch (e) {
        commandData.channel.send({
          embeds: [
            new MessageEmbed().setTitle("Error").setDescription(`\`\`\`${e}\`\`\``),
          ],
        });
        console.log(e);
      }
    } else {
      await commandData.reply({ content: "Needs work to do noob" });
    }
  },
};

export default run;
