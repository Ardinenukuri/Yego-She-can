"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.DATABASE_URL;
console.log('--- DATABASE CONNECTION DETAILS ---');
console.log('User:', process.env.DB_USER);
console.log('Host:', process.env.DB_HOST);
console.log('Database:', process.env.DB_name);
console.log('Port:', process.env.DB_PORT);
console.log('---------------------------------');
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '10233'),
    connectionString: connectionString,
    ssl: connectionString ? { rejectUnauthorized: false } : false,
});
pool.on('connect', () => {
    console.log('Connected to the Database!');
});
exports.default = pool;
