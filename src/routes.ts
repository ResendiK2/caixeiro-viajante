import express from 'express';

import {
    createClients,
    deleteClients,
    filterClientsController,
    listClientsController,
    getRoute
} from './controllers';

const routes = express.Router();

routes.get('/clients/route', getRoute);
routes.get('/clients', listClientsController);
routes.post('/clients', createClients);
routes.delete('/clients/:id', deleteClients);
routes.get('/clients/search/:filter', filterClientsController);

export { routes };
