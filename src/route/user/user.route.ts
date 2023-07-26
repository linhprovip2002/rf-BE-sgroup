import express from 'express';
import  UserController  from './user.controller.ts';
const route = express.Router();
route.get('',UserController.getUsers);
route
     .get('/:id',UserController.getUserById)
     .put('/:id',UserController.updateUserById)
     .delete('/:id',UserController.deleteUserById);


export default route;