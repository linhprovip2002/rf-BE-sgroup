import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { hashPassword, hashPasswordSalt, signJwt } from '../../service';
import { User } from '../../model';
import crypto from 'crypto';
import { mailService } from '../../service';
class authController {
    async login(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        const user = await authService.getUserByUsername(username);
        if (!user) {
            return res.status(400).json('username is not exist');
        }
        const hashPasswordUser = hashPasswordSalt(user.salt, password);
        if (hashPasswordUser !== user.password) {
            return res.status(400).json('password is wrong');
        }
        return await authService.findRole(user.id).then((roles) => {
            roles = roles.map((role) => {
                return role.role_name;
            });
            // console.log(roles);
            
            const token = signJwt(user, roles);
            return res.status(200).json({ status: 200, message: 'Login successfully', token: token });
          }).catch((err) => {
            console.log(err);
            next(err);
          });

    }
    async register(req: Request, res: Response, next: NextFunction) {
        const { username, password, email, age, name, gender } = req.body;
        // console.log(username, password, email, age, name, gender);
        const dateNow = Date.now();
        // console.log(dateNow);
        const user = await authService.getUserByUsername(username);
        if (user) {
            return res.status(400).json('username is exist');
        }
        const hashedPassword: any = hashPassword(password);
        // console.log(hashedPassword.salt);
        const newUser: User =
        {
            id: Date.now(),
            username: username,
            password: hashedPassword.passwordHashed,
            salt: hashedPassword.salt,
            email: email,
            age: age,
            name: name,
            gender: gender,
            passwordResetToken: crypto.randomBytes(20).toString('hex'),
            passwordResetExpires: new Date(dateNow + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(dateNow),
            createBy: 1
        }
        try {
            await authService.createUser(newUser);
            return res.status(200).json('register successfully');
        } catch (err) {
            console.log(err);
            next(err);
        }
        return res.status(500).json('An unexpected error occurred.');
    }
    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const { username, email } = req.body;
        const user = await authService.getUserByUsername(username);
        if (!user) {
            return res.status(400).json('email is not exist');
        }
        const htmlTemplate = `
        <h1>Forgot Password</h1>
        <p>Click <a href="http://localhost:3000/reset-password/${user.passwordResetToken}">here</a> to reset your password</p>
        `;
        
        try {
            await mailService.sendMail(email, 'Forgot Password', htmlTemplate);
            return res.status(200).json('send mail successfully');
        } catch (err) {
            console.log(err);
            next(err);
        }
        return res.status(500).json('An unexpected error occurred.');
    }
}

export default new authController();