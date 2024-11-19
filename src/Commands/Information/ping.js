import Command from "@Handlers";

export default class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Returns the bot's ping.",
      cooldown: 5000, 
      ownerOnly: false,
    });
  }

  async run(interaction, t) {
    const latency = interaction.client.ws.ping;
    await interaction.reply({
      content: t("ping.response", { latency }),
      ephemeral: true,
    });
  }
}
