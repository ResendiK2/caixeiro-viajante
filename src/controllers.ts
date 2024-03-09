import {
    createClient,
    deleteClient,
    filterClients,
    getClientById,
    listClients,
    updateClient
} from './database/clients'

const createClients = async (request: any, response: any) => {
    const { name, email, phone, coordinate_x, coordinate_y } = request.body;

    const client = await createClient(name, email, phone, coordinate_x, coordinate_y);

    response.json(client);
}

const deleteClients = async (request: any, response: any) => {
    const { id } = request.params;

    const deleted = await deleteClient(id);

    response.json(deleted);
}

const filterClientsController = async (request: any, response: any) => {
    try {

        const { name, email, phone } = request.query;

        const clients = await filterClients({ name, email, phone });

        response.json(clients);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

const getClientByIdController = async (request: any, response: any) => {
    const { id } = request.params;

    const client = await getClientById(id);

    response.json(client);
}

const listClientsController = async (_: any, response: any) => {
    const clients = await listClients();

    response.json(clients);
}

const updateClients = async (request: any, response: any) => {
    const { id } = request.params;

    const { name, email, phone, coordinate_x, coordinate_y } = request.body;

    const client = await updateClient(id, name, email, phone, coordinate_x, coordinate_y);

    response.json(client);
}

export {
    createClients,
    deleteClients,
    filterClientsController,
    getClientByIdController,
    listClientsController,
    updateClients
}

