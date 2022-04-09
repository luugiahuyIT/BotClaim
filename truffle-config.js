const Provider = require('@truffle/hdwallet-provider');
const privateKey = 'e574b1078d9299dbe809e344c1dcb03faaf286bed223722e1b9b745fb6dcbe58';
const provider = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545/'); 

module.exports = {

  networks: {
 
    bsc: {
      provider: () => provider,
      network_id: 97,
     // gas: 5500000,        // Ropsten has a lower block limit than mainnet
     // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
     // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
     // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10",
    }
  },

 
};
