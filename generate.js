// tslint:disable-next-line: no-require-imports
const BIP39 = require("bip39")
const { hdkey } = require('ethereumjs-wallet')
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const Coin = require('./build/contracts/Kelvin.json');
const privateKey = 'e574b1078d9299dbe809e344c1dcb03faaf286bed223722e1b9b745fb6dcbe58'
const address = '0x478b614C9bD34d23D3B57A6C7F176e189E92f549';
const bscUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const nodeCron = require('node-cron');
const express = require('express');
const Respone = require('./database/model');
const app = express();
const port = 3000;

const db = require('./database/connect');


db.connectDatabase();
const mnemonic = 'agent manual resource car renew fit deputy town horse odor run glimpse'

const providerMain = new Provider(privateKey, bscUrl);
const web3Main = new Web3(providerMain);

let addresses = []

const getByIndex = async (index) => {
  let seed = await BIP39.mnemonicToSeed(mnemonic)
  let hdwallet = hdkey.fromMasterSeed(seed)
  let path = `m/44'/60'/0'/0/`
  let wallet = hdwallet.derivePath(path + index).getWallet()
  let privateK = wallet.getPrivateKey().toString('hex')
  let publicK = '0x' + wallet.getAddress().toString('hex')
  addresses.push({ index: index, publicKey: publicK, privateKey: privateK })
  console.log(addresses[index])
  return { privateK, publicK }
}

const transfer = async (publicK) => {
  let nonce = await web3Main.eth.getTransactionCount('0xa488d95f9F275869C156e58Ba96b0913557f7A9D', 'pending'); // nonce starts counting from 0
  let transaction = {
    'to': publicK,
    'value': 100000000000000000,
    'gas': 30000,
    'nonce': nonce,
  };
  let signedTx = await web3Main.eth.accounts.signTransaction(transaction, privateKey);
  await web3Main.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
    if (!error) {
      console.log('The hash of your transaction is: ', hash);
    } else {
      console.log('Something went wrong while submitting your transaction:', error)
    }
  });
}
let index = 0;
const job = nodeCron.schedule('*/20 * * * * *', async () => {
  try {
    let indexExist = await Respone.findOne({ index: index })
    if (index === indexExist) return
    let { privateK, publicK } = await (getByIndex(index))
    await (transfer(publicK, index))
    await (callMethod(privateK, publicK, index))
    index++;
  } catch (err) {
    console.log(err)
  }
})

const callMethod = async (privateK, publicK, index) => {
  try {

    let provider = new Provider(privateK, bscUrl);
    let web3 = new Web3(provider);
    const myContract = new web3.eth.Contract(
      Coin.abi,
      address
    )

    let res = await myContract.methods.getData(1).send({ from: publicK })
    let balance = await web3.eth.getBalance(publicK)
    console.log(res)
    await Respone.create({
      index: index,
      transactionHash: res.transactionHash,
      privateKey: privateK,
      publicKey: publicK,
      balance: balance
    })
  }
  catch (error) {
    console.log(error)
  }
}

job.start()

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
