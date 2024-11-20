import Event from "#Handlers/Event.js";
import { ActivityType } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import Config from '#Config';
import { Logger } from '#Logger';

export default class extends Event {
  constructor(client) {
    super(client, {
      name: 'ready',
    });
  }

  run = async () => {
    this.client.user.presence.set({
      activities: [{ name: 'Respondendo @Mention', type: ActivityType.Watching }],
      status: 'online',
    });

    const channelId = Config.guild_channel_id;
    const channel = this.client.channels.cache.get(channelId);

    if (channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      Logger.success(`Conectado ao canal de voz: ${channel.name}`);
    } else {
      Logger.warn(`Canal de voz com ID ${channelId} não encontrado.`);
    }
  };
}
