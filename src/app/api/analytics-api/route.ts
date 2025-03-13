import {NextApiRequest, NextApiResponse} from 'next';
import {Pool} from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'northwind',
    password: 'postgres',
    port: 5432,
});
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const result = await pool.query(

            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
        );
        return {result: result.rows};

    } catch (error){
        console.error('Error fetching tables:', error);
        return {error: 'Error fetching data'};

    }


 }