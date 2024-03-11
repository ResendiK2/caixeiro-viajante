import { Pool } from 'pg';

export const connect = async () => {
    if (global.connection) {
        return global.connection.connect();
        // código usado para evitar que a aplicação se conecte ao banco de dados mais de uma vez
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    const client = await pool.connect();
    console.log('Connected to database');

    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);

    client.release();

    global.connection = pool;
    // código usado para evitar que a aplicação se conecte ao banco de dados mais de uma vez
    return pool.connect();
}

