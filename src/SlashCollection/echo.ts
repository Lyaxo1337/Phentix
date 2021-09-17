import { SlashCommandBuilder } from "@discordjs/builders";

const echo = new SlashCommandBuilder()
  .setName("echo")
  .setDescription("Echo your message!")
  .addStringOption((option) =>
    option.setName("message").setDescription("The message to repeat").setRequired(true)
  );

export default echo;
