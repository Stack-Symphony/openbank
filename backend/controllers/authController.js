const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    
    const { firstName, lastName, saIdNumber, email, phoneNumber, password } = req.body;

    // Validation
    if (!firstName || !lastName || !saIdNumber || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please include all required fields' 
      });
    }

    // Validate SA ID Number (13 digits)
    if (!/^\d{13}$/.test(saIdNumber)) {
      return res.status(400).json({
        success: false,
        message: 'South African ID number must be exactly 13 digits'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ saIdNumber }, { email }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this ID or Email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Bank Details
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const cardNumRaw = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    const cardNumber = cardNumRaw.match(/.{1,4}/g).join(' ');

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      saIdNumber,
      email,
      phoneNumber,
      password: hashedPassword,
      accountNumber,
      cardNumber,
      balances: { savings: 0, checking: 0, business: 0, investment: 0 }
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          accountNumber: user.accountNumber,
          cardNumber: user.cardNumber,
          token: generateToken(user._id)
        },
        message: 'Registration successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    
    const { saIdNumber, password } = req.body;

    // Check for user
    const user = await User.findOne({ saIdNumber });

    // Validate password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          accountNumber: user.accountNumber,
          cardNumber: user.cardNumber,
          balances: user.balances,
          token: generateToken(user._id) // Token is sent in the body
        },
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    
    // NOTE: This assumes req.user is populated by your protect middleware
    const user = await User.findById(req.user.id).select('-password'); 
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};