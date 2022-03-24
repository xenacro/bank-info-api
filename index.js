import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {origin: process.env.URL || '*'};
dotenv.config()
app.use(cors(corsOptions));
app.use(json());

app.get('/', async (req, res) => {
    // const create = await pool.query("CREATE TABLE bankinfos");
    const info = await pool.query("SELECT * FROM banks");
    // console.log(process.env.DATABASE_URL);
    res.json({"status":"success","message":"api running successfully","data":info});
});

app.get('/branches/autocomplete', async (req, res) => {
    // const create = await pool.query("CREATE TABLE bankinfos");
    let b=req.query?.q ? req.query?.q.toUpperCase() : '';
    let l=req.query.limit || 10;
    let o = req.query.offset || 0;
    const info = await pool.query(`SELECT ifsc, bank_id, branch, address, city, district, state FROM branches WHERE branch LIKE '${b}%' ORDER BY ifsc LIMIT ${l} OFFSET ${o}`);
    // console.log(req.query.q);
    res.json(info?.rows);
});

app.get('/branches', async (req, res) => {
    // const create = await pool.query("CREATE TABLE bankinfos");
    let q=req.query?.q ? req.query?.q.toUpperCase() : '';
    let l=req.query?.limit || 10;
    let o = req.query?.offset || 0;
    const info = await pool.query(`SELECT ifsc, bank_id, branch, address, city, district, state FROM branches WHERE (branch || ifsc || bank_id || address || city || district || state ) LIKE '${q}%' ORDER BY ifsc LIMIT ${l} OFFSET ${o}`);
    // console.log(req.query.q);
    res.json(info?.rows);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});


/**
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches/autocomplete'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches/autocomplete?q=ABH'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches/autocomplete?q=ABH&limit=4'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches/autocomplete?q=ABH&limit=4&offset=1'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches?q=ABH'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches?q=ABH&limit=4'
 * curl --location --request GET 'http://try-postgres-sql.herokuapp.com/branches?q=ABH&limit=4&offset=1'
 */