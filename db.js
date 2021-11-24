import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config()
const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'bankinfos'
}

const pool = new Pool(poolConfig);
export default pool;