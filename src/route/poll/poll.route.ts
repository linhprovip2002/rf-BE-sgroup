import express from 'express';

import pollController from './poll.controller';
const route = express.Router();

route.post('/', pollController.createPoll);
route.get('/', pollController.getAllPolls);
route.get('/:id', pollController.getPollById);
route.delete('/:id', pollController.deletePollById);
route.put('/:id', pollController.updatePoll);
export default route;