const mongoose = require('mongoose');

const users = new mongoose.Schema({
  username: { type: String, required: true },
});

// Creating the model
const usersModel = mongoose.model('Users', users);

// Exporting the model
module.exports = usersModel;
