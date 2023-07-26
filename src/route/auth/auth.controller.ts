import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import  { hashPassword, hashPasswordSalt, signJwt }  from '../../service';
class authController
{
    async login(req:Request, res:Response, next:NextFunction)
    {
        const { username, password } = req.body;
        const user = await authService.getUserByUsername(username);
        if(!user)
        {
            return res.status(400).json('username is not exist');
        }
        const hashPasswordUser = hashPasswordSalt(user.salt, password);
        if(hashPasswordUser !== user.password)
        {
            return res.status(400).json('password is wrong');
        }
        return await authService.findRole(user.id).then((roles) => {
            const token = signJwt(user, roles);
            return res.status(200).json({status: 200 , message:'Login successfully' ,token: token});
        }).catch((err) => {
            console.log(err);
            next(err);
        })
        
    }
    async register(req:Request, res:Response, next:NextFunction)
    {
        const { username, password, email, age, name,gender } = req.body;
        console.log(username, password, email, age, name,gender );
        const dateNow:Date = new Date();
        console.log(dateNow);
        const user = await authService.getUserByUsername(username);
        if(user)
        {
            return res.status(400).json('username is exist');
        }
        const hashedPassword:any = hashPassword(password);
        console.log(hashedPassword);
        return res.status(200).json('register successfully');
    }
}

export default new authController();