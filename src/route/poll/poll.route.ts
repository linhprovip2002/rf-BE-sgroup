import express from 'express';
import {checkAuthorization} from '../../middleware/index';
import pollController from './poll.controller';
const route = express.Router();

route.post('/',checkAuthorization('Create poll'),pollController.createPoll);
route.get('/',checkAuthorization('Read poll') ,pollController.getAllPolls);
route.get('/:id', checkAuthorization('Read poll') ,pollController.getPollById);
route.delete('/:id',checkAuthorization('Delete poll'),pollController.deletePollById);
route.put('/:id',checkAuthorization('Update poll'), pollController.updatePoll);
route.post('/:idPoll/vote/:idOption', pollController.votePoll);
route.delete('/:idPoll/vote/:idOption', pollController.unVotePoll);
route.delete('/:id/option', pollController.deleteOption);// id option
route.post('/:id/option', pollController.internOption);// id poll
export default route;