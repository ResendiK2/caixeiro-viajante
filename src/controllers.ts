import {
    createClient,
    deleteClient,
    filterClients,
    getClientByEmail,
    getClientById,
    listClients,
    updateClient
} from './database/clients'

const createClients = async (request: any, response: any) => {
    const { name, email, phone, coordinate_x, coordinate_y } = request.body || {}

    const clientExists = await getClientByEmail(email);

    if (clientExists)
        return response.status(400).json({ error: 'Email já cadastrado para outro cliente' });

    const client = await createClient(name, email, phone, coordinate_x, coordinate_y);

    response.status(201).json({
        success: true,
        response: client
    });
}

const deleteClients = async (request: any, response: any) => {
    const { id } = request.params;

    const deleted = await deleteClient(id);

    response.status(200).json({
        success: true,
        response: deleted
    });
}

const filterClientsController = async (request: any, response: any) => {
    const { filter } = request.params;

    const clients = await filterClients(filter);

    response.status(200).json({
        success: true,
        response: clients
    });
}

const getClientByIdController = async (request: any, response: any) => {
    const { id } = request.params;

    const client = await getClientById(id);

    response.status(200).json({
        success: true,
        response: client
    });
}

const listClientsController = async (_: any, response: any) => {
    const clients = await listClients();

    response.json({
        success: true,
        response: clients
    });
}

const updateClients = async (request: any, response: any) => {
    const { id } = request.params;

    const { name, email, phone, coordinate_x, coordinate_y } = request.body;

    const client = await updateClient(id, name, email, phone, coordinate_x, coordinate_y);

    response.status(200).json({
        success: true,
        response: client
    });
}

export {
    createClients,
    deleteClients,
    filterClientsController,
    getClientByIdController,
    listClientsController,
    updateClients
}

