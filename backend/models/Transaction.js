const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // Numeric amount for calculations
  amount: {
    type: Number,
    required: true
  },
  // Formatted string for display (e.g. "+R500.00")
  displayAmount: {
    type: String,
    required: true
  },
  // The primary account affected (e.g., 'Checking')
  account: {
    type: String,
    required: true
  },
  // For Transfers:
  fromAccount: {
    type: String
  },
  toAccount: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
