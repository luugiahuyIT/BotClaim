const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Respone = new Schema(
    {
      index: { type: Number },
      transactionHash: { type: String },
      publicKey: { type: String },
      privateKey: { type: String },
      balance: { type: Number },
     
    },
    { timestamps: true },
  );
  
  module.exports = mongoose.model('Respone', Respone);
