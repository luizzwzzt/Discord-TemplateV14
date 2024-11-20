import Event from "#Handlers/Event.js";
import { createEmbed } from "#Components"; // Importando o componente Embed

export default class extends Event {
  constructor(client) {
    super(client, {
      name: "messageCreate",
    });
  }

  run = async (message) => {
    if (message.channel.type === "DM" || message.author.bot) return;

    if (
      message.content === `<@${this.client.user.id}>` ||
      message.content === `<@!${this.client.user.id}>`
    ) {
      const embed = createEmbed({
        description: `Olá ${message.author} Use meu comando /ajuda para ver tudo o que posso fazer.`,
      });

      return message.reply({ embeds: [embed] });
    }
  };
}
