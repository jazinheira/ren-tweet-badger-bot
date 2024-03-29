console.log("[STARTING]");
require("dotenv").config();
const Twit = require("twit");
const Discord = require("discord.js");
const client = new Discord.Client();

setup();
async function setup() {
  // Get vars from AWS SecretsManager if available and overwrite anything from .env.
  let getSecrets = require("./getSecrets.js");
  console.log("[WAITING] Attempting to get secrets from AWS SecretsManager.");
  let secrets = await getSecrets(
    process.env.AWS_SECRET_NAME,
    process.env.AWS_REGION
  );

  if (secrets) {
    console.log("Finished getting secrets from AWS SecretsManager.");
    if (secrets.TWITTER_CONSUMER_KEY) {
      process.env.TWITTER_CONSUMER_KEY = secrets.TWITTER_CONSUMER_KEY;
    }
    if (secrets.TWITTER_CONSUMER_SECRET) {
      process.env.TWITTER_CONSUMER_SECRET = secrets.TWITTER_CONSUMER_SECRET;
    }
    if (secrets.TWITTER_ACCESS_TOKEN) {
      process.env.TWITTER_ACCESS_TOKEN = secrets.TWITTER_ACCESS_TOKEN;
    }
    if (secrets.TWITTER_ACCESS_TOKEN_SECRET) {
      process.env.TWITTER_ACCESS_TOKEN_SECRET =
        secrets.TWITTER_ACCESS_TOKEN_SECRET;
    }
    if (secrets.TWITTER_SCREEN_NAME) {
      process.env.TWITTER_SCREEN_NAME = secrets.TWITTER_SCREEN_NAME;
    }
    if (secrets.DISCORD_TOKEN) {
      process.env.DISCORD_TOKEN = secrets.DISCORD_TOKEN;
    }
    if (secrets.DISCORD_CHANNEL_ID) {
      process.env.DISCORD_CHANNEL_ID = secrets.DISCORD_CHANNEL_ID;
    }

    // Set up Twit.
    const T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
      strictSSL: true, // optional - requires SSL certificates to be valid.
    });

    // Set up Discord.
    client.login(process.env.DISCORD_TOKEN);

    // Ready.
    main(T);
  }
}

function main(T) {
  T.get(
    "users/show",
    { screen_name: [process.env.TWITTER_SCREEN_NAME] },
    function (err, data, response) {
      console.log("[Twitter ID] " + data.id_str);
      client.once("ready", () => {
        console.log("[READY]");
        var stream = T.stream("statuses/filter", { follow: [data.id_str] });

        stream.on("tweet", function (tweet) {
          //only show owner tweets
          if (tweet.user.id_str == data.id_str) {
            var url =
              "https://twitter.com/" +
              tweet.user.screen_name +
              "/status/" +
              tweet.id_str;
            //console.log('[New Tweet] '+ '('+tweet.user.screen_name+') '+ tweet.text);
            if (tweet.text.includes("🦡")) {
              console.log("[🦡]");
              try {
                let channel = client.channels
                  .fetch(process.env.DISCORD_CHANNEL_ID)
                  .then((channel) => {
                    channel.send(url);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } catch (error) {
                console.error(error);
              }
            }
          }
        });
      });
    }
  );
}
