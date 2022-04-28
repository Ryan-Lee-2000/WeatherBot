import { Intents } from 'discord.js';

export default {
  prefix: '!',
  token: process.env.DISCORD_TOKEN,
  key: process.env.WEATHER_API,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
}
