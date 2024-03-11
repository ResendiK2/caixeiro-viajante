import {
    createClient,
    deleteClient,
    filterClients,
    getClientByEmail,
    getClientById,
    listClients,
    updateClient
} from './database/clients'
import { IClient } from "./utils/types";

const createClients = async (request: any, response: any) => {
    const { name, email, phone, coordinate_x, coordinate_y } = request.body || {} as IClient

    const clientExists = await getClientByEmail(email);

    if (clientExists)
        return response.status(400).json({ error: 'Email já cadastrado para outro client' });

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

    const { name, email, phone, coordinate_x, coordinate_y } = request.body || {} as IClient

    const client = await updateClient(id, name, email, phone, coordinate_x, coordinate_y);

    response.status(200).json({
        success: true,
        response: client
    });
}

function setMatrix(clients: IClient[]) {
    let matrix = [];

    const ids = clients.map(client => client.id);

    for (let i = 0; i < clients.length; i++) {
        const clientI = clients[i];

        matrix.push({ [clientI.id]: ids.map((id, j) => ({ [id]: getDistance(clientI, clients[j]) })) });
    }

    return matrix;
}

function getDistance(client1: IClient, client2: IClient) {
    return Math.sqrt(
        Math.pow(client1.coordinate_x - client2.coordinate_x, 2) +
        Math.pow(client1.coordinate_y - client2.coordinate_y, 2)
    );
}

function greedy(matrix: any): Set<string> {
    const route = [];
    const visits: Set<string> = new Set();

    let current = matrix[0];

    visits.add(Object.keys(current)[0]);

    route.push(current);

    while (visits.size < matrix.length) {
        const next = Object.values(current[Object.keys(current)[0]])
            .filter((value: any) => !visits.has(Object.keys(value)[0]))
            .sort((a: any, b: any) => +Object.values(a)[0] - +Object.values(b)[0])[0];

        if (next) {
            current = matrix.find((client: any) => Object.keys(client)[0] === Object.keys(next)[0]);
            visits.add(Object.keys(next)[0]);
            route.push(current);
        }
    }

    return visits;
}

function caixeiroViajante(clients: IClient[]): Set<string> {
    const matrix = setMatrix(clients);

    console.log("Matriz de distâncias:", matrix);

    return greedy(matrix);
}

async function getRoute(_: any, response: any) {
    try {
        const clients = await listClients();

        clients.unshift({ id: '0', name: "Base", email: "", phone: "", coordinate_x: 0, coordinate_y: 0 });

        const visits = caixeiroViajante(clients);

        const visited = [];

        visits.forEach((id) => {
            visited.push(clients.find((client: IClient) => {
                const clientId = client.id

                return clientId == id
            }));
        });

        response.status(200).json({ success: true, response: visited });
    } catch (error) {
        console.error(error);
    }
}

export {
    createClients,
    deleteClients,
    filterClientsController,
    getClientByIdController,
    listClientsController,
    updateClients,
    getRoute,
}

