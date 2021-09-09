const fs = require('fs')
const path = require('path')

require("@nomiclabs/hardhat-waffle");
require("hardhat-watcher");
require("hardhat-gas-reporter");

const accounts = readJson(`./accounts.json`);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${accounts.alchemy.apiKey}`,
      accounts: [`0x${accounts.ropsten.privateKey}`],
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true
    }
  },
  gasReporter: {
    enabled: false,
    currency: 'EUR',
    coinmarketcap: `${accounts.coinmarketcap.apiKey}`
  }
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
