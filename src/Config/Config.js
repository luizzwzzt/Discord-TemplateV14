import dotenv from 'dotenv';
dotenv.config();

export default {
  // embed
  color: 0x0099ff,
  
  prefix: '!',
  clientid: process.env.clientid,
  owners: process.env.owwner_id,
  guild_channel_id: process.env.guild_channel_id,
  token: process.env.TOKEN,
  mongoURI: process.env.mongoURI,
};
