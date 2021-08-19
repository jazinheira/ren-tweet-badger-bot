const axios = require("axios");
const cheerio = require("cheerio");

async function fetch(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function getEtherscanData(txUrl) {
  const txDetails = await fetch(txUrl).then((res) => {
    let txData = new Object();
    let wrapperField = "#wrapperContent > li";

    res(wrapperField).each(function (i, elm) {
      //console.log(res(this).text()) // for testing do text()
      if (res(this).text().includes("Badger: Dev Multisig")) {
        var row = res(this).text().split(" ");
        txData.to = row[2] + " " + row[3] + " " + row[4];
        txData.amountToken = row[6];
        txData.amountUSD = row[8];
        txData.token = row[9];
      }
    });

    return txData;
  });

  return txDetails;
}

module.exports = {
  getEtherscanData,
};
