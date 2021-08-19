const { getEtherscanData } = require("./getEtherscanData.js");
const Discord = require("discord.js");
require("./getEtherscanData.js");

const bannerUrl =
  "https://cryptoslate.com/wp-content/uploads/2020/12/Badger-DAO-social.jpg";

function sendEmbed(Discord, client, channelId, tweet, url) {
  if (tweet.entities.urls[0] === undefined) {
    // Post didn't include an expanded url, which can cause some errors.
    sendMsg(Discord, client, channelId, tweet, url);
  } else {
    getEtherscanData(tweet.entities.urls[0].expanded_url).then((txDetails) => {
      sendMsg(Discord, client, channelId, tweet, url, txDetails);
    });
  }
}

function createEmbed(Discord, client, tweet, url, txDetails = null) {
  let authorName = tweet.user.name + " (@" + tweet.user.screen_name + ")";

  let txField = "N/A";
  if (txDetails) {
    txField =
      txDetails.amountToken + " " + txDetails.token + " " + txDetails.amountUSD;
  }

  let msg = new Discord.MessageEmbed()
    .setColor("#f2a727")
    .setAuthor(authorName, tweet.user.profile_image_url_https, url)
    .setDescription(tweet.text)
    .addField("Fees sent to Badger: ", txField)
    .setImage(bannerUrl)
    .addField("---", `[${url}](${url})`);

  return msg;
}

function sendMsg(Discord, client, channelId, tweet, url, txDetails = null) {
  let msg = createEmbed(Discord, client, tweet, url, txDetails);
  try {
    let channel = client.channels
      .fetch(channelId)
      .then((channel) => {
        channel.send(msg);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendEmbed,
};
