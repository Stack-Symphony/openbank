const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name']
  },
  saIdNumber: {
    type: String,
    required: [true, 'Please add a South African ID number'],
    unique: true,
    length: 13
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    //required: [true, 'Please add a phone number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  // Generated Banking Details
  accountNumber: {
    type: String,
    unique: true
  },
  cardNumber: {
    type: String
  },
  // Embedded Balances Object
  balances: {
    savings: { type: Number, default: 0 },
    checking: { type: Number, default: 0 },
    business: { type: Number, default: 0 },
    investment: { type: Number, default: 0 }
  },
  // Security Settings
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
