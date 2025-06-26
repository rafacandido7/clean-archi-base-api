// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'test');

// Create application user with read/write permissions
db.createUser({
  user: process.env.MONGO_APP_USERNAME || 'app_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE || 'test'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "cpf": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });
db.users.createIndex({ "updatedAt": 1 });

print('MongoDB initialization completed successfully!');
