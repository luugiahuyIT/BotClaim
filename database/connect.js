const mongoose = require('mongoose');


 async function connectDatabase() {
  try {
    const MONGODB_URI = 'mongodb://localhost:27017/reward';
    await mongoose.connect(MONGODB_URI);
    return console.log(`Database connected`);
  } catch (error) {
    return (console.log(error), process.exit(1));
  }
}
module.exports = { connectDatabase };
