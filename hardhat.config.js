const fs = require('fs')
const path = require('path')

require("@nomiclabs/hardhat-waffle");

const accounts = readJson(`./accounts.json`);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${accounts.alchemy.apiKey}`,
      accounts: [`0x${accounts.ropsten.privateKey}`],
    },
  },
};

function readJson(fileName) {
  let data
  try {
    const filePath = path.join(__dirname, fileName)
    data = fs.readFileSync(filePath)
  } catch (err) {
    return null
  }
  return JSON.parse(data)
}
