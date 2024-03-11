import { connect } from './connection';

export const listClients = async () => {
    const client = await connect();

    const res = await client.query('SELECT * FROM clients');

    client.release();

    return res.rows;
}

export const getClientByEmail = async (email: string) => {
    const client = await connect();

    const res = await client.query('SELECT * FROM clients WHERE email = $1', [email]);

    client.release();

    return res.rows[0];
}

export const createClient = async (name: string, email: string, phone: string, coordinate_x: number, coordinate_y: number) => {
    const client = await connect();

    const res = await client.query('INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, email, phone, +coordinate_x, +coordinate_y]);

    client.release();

    return res.rows[0];
}

export const deleteClient = async (id: string) => {
    const client = await connect();

    const res = await client.query('DELETE FROM clients WHERE id = $1', [id]);

    client.release();

    return res.rowCount;
}

export const filterClients = async (filter) => {
    const client = await connect();

    // Aqui preferi usar a função de distância de Levenshtein para fazer a busca por similaridade. 
    // Poderia ser feito de outras formas também, como por exemplo, usando o operador LIKE para 
    // buscar por similaridade no banco de dados ou o operador SOUNDEX, para buscar por similaridade fonética.
    const res = await client.query('SELECT * FROM clients WHERE LEVENSHTEIN(name, $1) < 3 OR LEVENSHTEIN(email, $1) < 3 OR LEVENSHTEIN(phone, $1) < 3', [filter]);

    client.release();

    return res.rows;
}
