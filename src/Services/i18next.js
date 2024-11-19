import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.join(__dirname, '../../src/Locales');

i18next
  .use(Backend)
  .init({
    fallbackLng: 'pt-BR',
    preload: getSupportedLanguages(),
    backend: {
      loadPath: path.join(localesPath, '/{{lng}}/{{ns}}.json'),
    },
    ns: ['commands', 'errors'],
    defaultNS: 'commands',
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

function getSupportedLanguages() {
  try {
    return fs
      .readdirSync(localesPath) 
      .filter((file) => fs.statSync(path.join(localesPath, file)).isDirectory()); 
  } catch (error) {
    console.error('Erro ao carregar idiomas suportados:', error);
    return ['pt-BR']; 
  }
}

export default i18next;
