import { Client } from 'discord.js';
import config from './config';
import helpCommand from './commands';

const { intents, prefix, token, key } = config;

const request = require("request");

const client = new Client({
  intents,
  presence: {
    status: 'online',
    activities: [{
      name: `${prefix}help`,
      type: 'LISTENING'
    }]
  }
});

client.on('ready', () => {
  console.log(`Logged in as: ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift();

    switch(command) {
      case 'ping':
        const msg = await message.reply('Pinging...');
        await msg.edit(`Pong! The round trip took ${Date.now() - msg.createdTimestamp}ms.`);
        break;

      case 'help':
        const msg_help = await message.reply("Hi! Thanks for using me! Here are the commands available:\n!weather shows the current weather \n!forecast shows the weather for tomorrow");
        break;
        
      case 'weather':
        const msg1 = await message.reply('Checking the weather now...');
        request('http://api.weatherapi.com/v1/forecast.json?key=221f2254633544d4b0f75511222804&q=Singapore&days=1&aqi=no&alerts=no', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const res_data = JSON.parse(body);
            const current_temp = res_data.current.temp_c
            const condition = res_data.current.condition.text;
            const send_message = "The current temperature is around " + current_temp + " Celcius" + "\n" + "It's currently " + condition
            msg1.edit(send_message);
            
          }
        })
        break;

      case 'forecast':
        const msg2 = await message.reply('Checking the forecast now...');
        request('http://api.weatherapi.com/v1/forecast.json?key=' + key + '&q=Singapore&days=2&aqi=no&alerts=no', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const res_data = JSON.parse(body);
            const forecast = res_data.forecast.forecastday

            const day = forecast[1].date;

            const maxtemp_c = forecast[1].day.maxtemp_c
            const mintemp_c = forecast[1].day.mintemp_c
            const avgtemp_c = forecast[1].day.avgtemp_c

            const condition = forecast[1].day.condition.text

            const response_msg = "Here is your forcast for tomorrow, " + day + "\n" +
              "Max Temp: " + maxtemp_c + "\n" +
              "Min Temp: " + mintemp_c + "\n" +
              "Avg Temp: " + avgtemp_c + "\n" +
              "Condition " + condition;
             
            //console.log(response_msg)
            msg2.edit(response_msg)
          }
        })
    }
  }
});

client.login(token);
