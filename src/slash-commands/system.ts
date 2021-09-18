import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";

const system = new SlashCommandBuilder()
  .setName("system")
  .setDescription("a set of commands the bot owners can use.");

system.addSubcommandGroup((group: SlashCommandSubcommandGroupBuilder) =>
  group
    .setName("debug")
    .setDescription("commands to debug the bot.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eval")
        .setDescription("evaluates JavaScript within the bot scope.")
        .addStringOption((option) =>
          option.setName("code").setDescription("the code to evaluate").setRequired(true)
        )
    )
);
export default system;
