// MongoDB initialization script
db = db.getSiblingDB('openbank');

// Create application user
db.createUser({
  user: 'openbank_user',
  pwd: 'openbank_password',
  roles: [
    { role: 'readWrite', db: 'openbank' },
    { role: 'dbAdmin', db: 'openbank' }
  ]
});

// Create collections and indexes
db.createCollection('users');
db.createCollection('transactions');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ saIdNumber: 1 }, { unique: true });
db.transactions.createIndex({ user: 1, date: -1 });

print('MongoDB initialized successfully');