import YutzClient from './Client.js';
import { Logger } from './Services/Logger.js';

(async () => {
  const client = new YutzClient();
  try {
    await client.start(); 
  } catch (error) {
    Logger.error('Erro ao inicializar o bot:', error);
    process.exit(1);
  }
})();
