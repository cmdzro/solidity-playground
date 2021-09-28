const fs = require('fs')
const path = require('path')

require("@nomiclabs/hardhat-waffle");
require("hardhat-watcher");
require("hardhat-gas-reporter");

const NETWORK_NAME = getNetworkName()
const ETH_ACCOUNT_NAME = process.env.ETH_ACCOUNT_NAME

const accounts = readJson(`./accounts.json`) || {
  eth: { dev: "remote" },
  alchemy: { apiKey: undefined },
  coinmarketcap: { apiKey: undefined }
}

const getNetConfig = (networkName, ethAccountName) => {
  const ethAccts = accounts.eth || {}
  const base = {
    accounts: ethAccountName === 'remote' ? 'remote' : ethAccts[ethAccountName] || ethAccts[networkName] || ethAccts.dev || 'remote',
    timeout: 60000
  }
  const dev = {
    ...base,
    url: 'http://localhost:8545',
    chainId: 1337,
    gas: 8000000 // the same as in Görli
  }
  const byNetName = {
    dev,
    ropsten: {
      ...base,
      url: `https://eth-ropsten.alchemyapi.io/v2/${accounts.alchemy.apiKey}`,
      chainId: 4,
      timeout: 60000 * 10
    }
  }
  const netConfig = byNetName[networkName]
  return netConfig ? { [networkName]: netConfig } : {}
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: NETWORK_NAME,
  networks: getNetConfig(NETWORK_NAME, ETH_ACCOUNT_NAME),
  solidity: "0.8.0",
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true
    }
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    currency: 'EUR',
    coinmarketcap: `${accounts.coinmarketcap.apiKey}`
  }
};

function getNetworkName() {
  if (process.env.HARDHAT_NETWORK) {
    // Hardhat passes the network to its subprocesses via this env var
    return process.env.HARDHAT_NETWORK
  }
  const networkArgIndex = process.argv.indexOf('--network')
  return networkArgIndex !== -1 && networkArgIndex + 1 < process.argv.length
    ? process.argv[networkArgIndex + 1]
    : process.env.NETWORK_NAME || 'hardhat'
}

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
