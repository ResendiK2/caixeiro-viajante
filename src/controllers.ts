import {
    createClient,
    deleteClient,
    filterClients,
    getClientByEmail,
    listClients,
} from './database/clients'
import { IClient } from "./utils/types";

const createClients = async (request: any, response: any) => {
    const { name, email, phone, coordinate_x, coordinate_y } = request.body || {} as IClient

    const clientExists = await getClientByEmail(email);

    if (clientExists)
        return response.status(400).json({ error: 'Email já cadastrado em outro cliente' });

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

const listClientsController = async (_: any, response: any) => {
    const clients = await listClients();

    response.json({
        success: true,
        response: clients
    });
}

function setMatrix(clients: IClient[]) {
    // função que retorna a matriz de distâncias
    return clients.map(clientI => {
        return {
            [clientI.id]: clients.map((clientJ) => {
                return { [clientJ.id]: getDistance(clientI, clientJ) }
            })
        }
    });
}

function getDistance(client1: IClient, client2: IClient) {
    // função que retorna a distância entre dois clientes
    return Math.abs(client1.coordinate_x - client2.coordinate_x) + Math.abs(client1.coordinate_y - client2.coordinate_y);
}

function greedy(matrix: any): Set<string> {
    // função que retorna a rota do caixeiro viajante pelo método guloso

    const route = [];
    const visits: Set<string> = new Set();

    let current = matrix[0];

    visits.add(Object.keys(current)[0]);

    route.push(current);

    while (visits.size < matrix.length) {
        const next = Object.values(current[Object.keys(current)[0]])
            .filter((value: any) => !visits.has(Object.keys(value)[0]))
            .sort((a: any, b: any) => +Object.values(a)[0] - +Object.values(b)[0])[0];
        // pega o próximo cliente que ainda não foi visitado e que está mais próximo do cliente atual

        if (next) {
            current = matrix.find((client: any) => Object.keys(client)[0] === Object.keys(next)[0]);
            visits.add(Object.keys(next)[0]);
            route.push(current);
        }
    }

    return visits;
}

function caixeiroViajante(clients: IClient[]): Set<string> {
    // função que retorna a rota do caixeiro viajante
    const matrix = setMatrix(clients);

    return greedy(matrix);
}

async function getRoute(_: any, response: any) {
    try {
        const clients = await listClients();

        clients.unshift({ id: '0', name: "Base", email: "", phone: "", coordinate_x: 0, coordinate_y: 0 });

        const visits = caixeiroViajante(clients);

        const visited = [];

        visits.forEach((id) => {
            if (id === '0') return;

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
    listClientsController,
    getRoute,
}

