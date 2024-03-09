import { connect } from './connection';

export const listClients = async () => {
    const client = await connect();

    const res = await client.query('SELECT * FROM clients');

    client.release();

    return res.rows;
}

export const getClientById = async (id: string) => {
    const client = await connect();

    const res = await client.query('SELECT * FROM clients WHERE id = $1', [id]);

    client.release();

    return res.rows[0];
}

export const createClient = async (name: string, email: string, phone: string, coordinate_x: string, coordinate_y: string) => {
    const client = await connect();

    const res = await client.query('INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, email, phone, coordinate_x, coordinate_y]);

    client.release();

    return res.rows[0];
}

export const updateClient = async (id: string, name: string, email: string, phone: string, coordinate_x: string, coordinate_y: string) => {
    const client = await connect();

    const res = await client.query('UPDATE clients SET name = $1, email = $2, phone = $3, coordinate_x = $4, coordinate_y = $5 WHERE id = $6 RETURNING *', [name, email, phone, coordinate_x, coordinate_y, id]);

    client.release();

    return res.rows[0];
}

export const deleteClient = async (id: string) => {
    const client = await connect();

    const res = await client.query('DELETE FROM clients WHERE id = $1', [id]);

    client.release();

    return res.rowCount;
}

export const filterClients = async ({ name, email, phone }: { name: string, email: string, phone: string }) => {
    const client = await connect();

    console.log(name, email, phone);

    const res = await client.query('SELECT * FROM clients WHERE name ILIKE $1 OR email ILIKE $2 OR phone ILIKE $3', [name || '', email || '', phone || '']);

    client.release();

    return res.rows;
}
