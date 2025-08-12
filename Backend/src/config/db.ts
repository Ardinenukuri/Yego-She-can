import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


console.log('--- DATABASE CONNECTION DETAILS ---');
console.log('User:', process.env.DB_USER);
console.log('Host:', process.env.DB_HOST);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);
console.log('---------------------------------');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),

  ssl: {
    rejectUnauthorized: false
  }
});

// Use a more robust connection check
pool.connect()
  .then(() => {
    console.log('Successfully connected to the PostgreSQL database!');
  })
  .catch(err => {
    console.error('FATAL DATABASE CONNECTION ERROR:', err);
  });

export default pool;

// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();
// const connectionString = process.env.DATABASE_URL;

// console.log('--- DATABASE CONNECTION DETAILS ---');
// console.log('User:', process.env.DB_USER);
// console.log('Host:', process.env.DB_HOST);
// console.log('Database:', process.env.DB_NAME);
// console.log('Port:', process.env.DB_PORT);
// console.log('---------------------------------');

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: parseInt(process.env.DB_PORT || '10233'),

//     connectionString: connectionString,
//   ssl: connectionString ? { rejectUnauthorized: false } : false,

// });

// pool.on('connect', () => {
//     console.log('Connected to the Database!');
// });

// export default pool;