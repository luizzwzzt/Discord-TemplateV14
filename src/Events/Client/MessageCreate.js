import Event from '#Handlers/Event.js';
import { createEmbed } from '#Components'; 
import i18next from '#Services/i18next.js';

export default class extends Event {
  constructor(client) {
    super(client, {
      name: 'messageCreate',
    });
  }

  run = async (message) => {
    if (message.channel.type === 'DM' || message.author.bot) return;

    if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) {
      const serverLanguage = await this.client.dbWrapper.getLanguage(message.guild.id);

      const embed = createEmbed({
        description: i18next.t('events:mention_reply', {  
          lng: serverLanguage,
          user: `<@${message.author.id}>`,
        }),
      });

      return message.reply({ embeds: [embed] });
    }
  };
}
