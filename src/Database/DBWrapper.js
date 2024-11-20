import mongoose from 'mongoose';
import { Logger } from '#Logger';
import Config from '#Config';
import { Server } from './Schemas/GuildSchema.js';

export class DBWrapper {
  constructor() {
    this.mongoose = mongoose;
  }

  async connect() {
    try {
      await this.mongoose.connect(Config.mongoURI);
      Logger.custom({ name: 'MONGODB', options: ['cyan', 'bold'] }, 'Database connected successfully');
    } catch (error) {
      Logger.error('Failed to connect to the database:', error);
    }
  }

  async updateLanguage(serverId, lang) {
    try {
      await Server.findOneAndUpdate({ serverId: serverId }, { language: lang }, { upsert: true });
    } catch (error) {
      Logger.error(`Failed to update language for server ${serverId}:`, error);
    }
  }

  async getLanguage(serverId) {
    try {
      const serverData = await Server.findOne({ serverId });
      return serverData ? serverData.language : 'pt-BR';
    } catch (error) {
      Logger.error(`Failed to get language for server ${serverId}:`, error);
      return 'pt-BR';
    }
  }

  // Método para calcular latência do MongoDB
  async getLatency() {
    try {
      const start = Date.now();
      await this.mongoose.connection.db.admin().ping(); // Pinga o MongoDB
      return Date.now() - start; // Retorna o tempo em milissegundos
    } catch (error) {
      Logger.error('[MONGODB] Error while measuring database latency:', error);
      return null;
    }
  }
}
