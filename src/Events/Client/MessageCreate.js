import Event from "../../Handlers/Event.js";

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
      return message.reply({
        content: "testando",
      });
    }
  };
}
