console.log('[STARTING]');
require('dotenv').config();
const Twit = require('twit')
const Discord = require('discord.js');
const client = new Discord.Client();

// Get vars from AWS SecretsManager if available and overwrite anything from .env.
let getSecrets = require('./getSecrets.js');
if(getSecrets.getSecret("TWITTER_CONSUMER_KEY", process.env.AWS_REGION)) {
  process.env.TWITTER_CONSUMER_KEY = getSecrets.getSecret("TWITTER_CONSUMER_KEY", process.env.AWS_REGION);
}
if(getSecrets.getSecret("TWITTER_CONSUMER_SECRET", process.env.AWS_REGION)) {
  process.env.TWITTER_CONSUMER_SECRET = getSecrets.getSecret("TWITTER_CONSUMER_SECRET", process.env.AWS_REGION);
}
if(getSecrets.getSecret("TWITTER_ACCESS_TOKEN", process.env.AWS_REGION)) {
  process.env.TWITTER_ACCESS_TOKEN = getSecrets.getSecret("TWITTER_ACCESS_TOKEN", process.env.AWS_REGION);
}
if(getSecrets.getSecret("TWITTER_ACCESS_TOKEN_SECRET", process.env.AWS_REGION)) {
  process.env.TWITTER_ACCESS_TOKEN_SECRET = getSecrets.getSecret("TWITTER_ACCESS_TOKEN_SECRET", process.env.AWS_REGION);
}
if(getSecrets.getSecret("TWITTER_SCREEN_NAME", process.env.AWS_REGION)) {
  process.env.TWITTER_SCREEN_NAME = getSecrets.getSecret("TWITTER_SCREEN_NAME", process.env.AWS_REGION);
}
if(getSecrets.getSecret("DISCORD_TOKEN", process.env.AWS_REGION)) {
  process.env.DISCORD_TOKEN = getSecrets.getSecret("DISCORD_TOKEN", process.env.AWS_REGION);
}
if(getSecrets.getSecret("DISCORD_CHANNEL_ID", process.env.AWS_REGION)) {
  process.env.DISCORD_CHANNEL_ID = getSecrets.getSecret("DISCORD_CHANNEL_ID", process.env.AWS_REGION);
}

var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

client.login(process.env.DISCORD_TOKEN);

console.log('[Twitter Screen Name] '+process.env.TWITTER_SCREEN_NAME);
T.get('users/show', { screen_name: [process.env.TWITTER_SCREEN_NAME] }, function(err, data, response) {
  
  console.log('[Twitter ID] '+ data.id_str);
  client.once('ready', () => {
      console.log('[READY]');
      var stream = T.stream('statuses/filter', { follow: [data.id_str] })
      
      stream.on('tweet', function (tweet) {

        //only show owner tweets
        if(tweet.user.id_str == data.id_str) {
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        //console.log('[New Tweet] '+ '('+tweet.user.screen_name+') '+ tweet.text);
        if(tweet.text.includes("🦡")) {
          console.log("[🦡]");
          try {
            let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel => {
              channel.send(url);
            }).catch(err => {
              console.log(err);
            })
          } catch (error) {
                console.error(error);
            }
        }
        }
      })
    })
  })