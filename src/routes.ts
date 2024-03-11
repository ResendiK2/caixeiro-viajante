import express from 'express';

import {
    createClients,
    deleteClients,
    filterClientsController,
    getClientByIdController,
    listClientsController,
    updateClients,
    getRoute
} from './controllers';

const routes = express.Router();

routes.get('/clients/route', getRoute);
routes.get('/clients', listClientsController);
routes.get('/clients/:id', getClientByIdController);
routes.post('/clients', createClients);
routes.put('/clients/:id', updateClients);
routes.delete('/clients/:id', deleteClients);
routes.get('/clients/search/:filter', filterClientsController);

export { routes };
