const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(50); // Limit to 50 most recent transactions

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, amount, title, accountType, toAccountType, description } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Invalid amount');
    }

    const accKey = accountType.toLowerCase();
    
    // Validate account existence
    if (user.balances[accKey] === undefined) {
      throw new Error('Invalid account type');
    }

    // --- Logic based on Type ---
    if (type === 'deposit') {
      user.balances[accKey] += numAmount;
    } else if (type === 'withdrawal') {
      if (user.balances[accKey] < numAmount) {
        throw new Error('Insufficient funds');
      }
      user.balances[accKey] -= numAmount;
    } else if (type === 'transfer') {
      const toKey = toAccountType ? toAccountType.toLowerCase() : null;
      if (!toKey || user.balances[toKey] === undefined) {
        throw new Error('Invalid destination account');
      }
      if (accKey === toKey) {
        throw new Error('Cannot transfer to same account');
      }
      if (user.balances[accKey] < numAmount) {
        throw new Error('Insufficient funds');
      }

      // Deduct from Source
      user.balances[accKey] -= numAmount;
      // Add to Destination
      user.balances[toKey] += numAmount;
    } else {
      throw new Error('Invalid transaction type');
    }

    // Save Updated User Balances
    await user.save({ session });

    // Create Transaction Record
    const formattedAmount = `${type === 'withdrawal' ? '-' : (type === 'transfer' ? '' : '+')}R${numAmount.toFixed(2)}`;
    
    // Capitalize helper
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const transaction = new Transaction({
      user: userId,
      type,
      amount: numAmount,
      displayAmount: formattedAmount,
      title: title || description || `${cap(type)} transaction`,
      account: cap(accKey),
      fromAccount: type === 'transfer' ? cap(accKey) : undefined,
      toAccount: type === 'transfer' ? cap(toAccountType) : undefined
    });

    await transaction.save({ session });

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: {
        balances: user.balances,
        transaction
      },
      message: 'Transaction completed successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Transaction Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get account balance
// @route   GET /api/transactions/balance/:accountType
// @access  Private
exports.getAccountBalance = async (req, res) => {
  try {
    const { accountType } = req.params;
    const user = await User.findById(req.user.id).select('balances');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const balance = user.balances[accountType.toLowerCase()];
    
    if (balance === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account type'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        accountType,
        balance,
        formattedBalance: `R${balance.toFixed(2)}`
      }
    });
  } catch (error) {
    console.error('Get Balance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};