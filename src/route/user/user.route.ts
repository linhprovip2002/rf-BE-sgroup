import express from 'express';
import  UserController  from './user.controller.ts';
import {clearCache} from '../../middleware/index';
import {checkAuthorization} from '../../middleware/index';
const route = express.Router();
route.get('',checkAuthorization('Read User') , UserController.getUsers);
route
     .get('/:id',checkAuthorization('Read User') ,UserController.getUserById)
     .put('/:id',checkAuthorization('Update User'),clearCache,UserController.updateUserById)
     .delete('/:id',checkAuthorization('Delete User'),clearCache,UserController.deleteUserById);


export default route;