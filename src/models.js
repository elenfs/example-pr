const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

export const Connection = mongoose.model('Connection', schema)
