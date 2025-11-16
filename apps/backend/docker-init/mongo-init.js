// MongoDB initialization script
db = db.getSiblingDB('prettyfull-ecommerce');

// Create collections with basic setup
db.createCollection('users');
db.createCollection('products');
db.createCollection('categories');
db.createCollection('orders');
db.createCollection('sitecontents');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.categories.createIndex({ slug: 1 }, { unique: true });
db.sitecontents.createIndex({ key: 1 }, { unique: true });

print('Database initialized successfully!');
