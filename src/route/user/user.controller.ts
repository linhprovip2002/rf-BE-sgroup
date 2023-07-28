import { Request, Response, NextFunction } from 'express';
import userService from './user.service';
import cacheService from '../../service/cache/cache.service';
class UserController {
    getUsers(req, res: Response, next: NextFunction): void {
        cacheService.get('users', 'all').then((users) => {
            if (users) {
                console.log('get users from cache');
                
                return res.status(200).json(users);
            }
            return userService.getAllUser().then((users) => {
                cacheService.set('users', 'all', users);
                console.log('get users from db');
                return res.status(200).json(users);
            }).catch((err) => {
                next(err);
            });
        }).catch((err) => {
            next(err);
        });
    }
    getUserById(req: Request, res: Response, next: NextFunction): void {
        const idUser: number = parseInt(req.params.id);
        userService.getUserById(idUser).then((user) => {
            return res.status(200).json(user);
        }).catch((err) => {
            next(err);
        });
    }
    updateUserById(req: Request, res: Response, next: NextFunction): void {
        const idUser: number = parseInt(req.params.id);
        const { name, age, gender, email } = req.body;
        userService.updateUserById(idUser, name, age, gender, email)
            .then((user) => {
                return res.status(200).json('update user successfully');
            }
            ).catch((err) => {
                next(err);
            }
            );

    }
    deleteUserById(req: Request, res: Response, next: NextFunction): void {
        const idUser: number = parseInt(req.params.id);
        userService.deleteUserById(idUser).then((user) => {
            return res.status(200).json('delete user successfully');
        }
        ).catch((err) => {
            next(err);
        }
        );
    }

}
export default new UserController();