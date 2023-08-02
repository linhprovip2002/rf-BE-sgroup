import express from 'express';
import  { userController }  from './index';
import {clearCache} from '../../middleware/index';
import {checkAuthorization} from '../../middleware/index';
const route = express.Router();
route.get('',checkAuthorization('Read User') , userController.getUsers);
route
     .get('/:id',checkAuthorization('Read User') ,userController.getUserById)
     .put('/:id',checkAuthorization('Update User'),clearCache,userController.updateUserById)
     .delete('/:id',checkAuthorization('Delete User'),clearCache,userController.deleteUserById);


export default route;