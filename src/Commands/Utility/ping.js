import Command from '#Handlers/Command.js';

export default class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: "Returns the bot's ping.",
      cooldown: 5000,
    });
  }

  async run(interaction, t) {
    const latency = interaction.client.ws.ping;

    let dbLatency = 'N/A';
    try {
      dbLatency = await interaction.client.dbWrapper.getLatency();
      if (dbLatency === null) dbLatency = 'Error when measuring';
    } catch (error) {
      console.error('[PING COMMAND] Failed to fetch database latency:', error);
    }

    await interaction.reply({
      content: t('ping', { latency, dbLatency }),
      ephemeral: true,
    });
  }
}
