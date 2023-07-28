import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { hashPassword, hashPasswordSalt, signJwt } from '../../service';
import { User } from '../../model';
import crypto from 'crypto';
import { mailService } from '../../service';
class authController {
    static dateNow = Date.now();
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
        
        // console.log(dateNow);
        const user = await authService.getUserByUsername(username);
        if (user) {
            return res.status(400).json('username is exist');
        }
        const hashedPassword: any = hashPassword(password);
        // console.log(hashedPassword.salt);
        let id:number = crypto.randomBytes(1)[0] % 255;
        // console.log(id);
       
        
        const newUser: User =
        {
            id: id,
            username: username,
            password: hashedPassword.passwordHashed,
            salt: hashedPassword.salt,
            email: email,
            age: age,
            name: name,
            gender: gender,
            passwordResetToken: crypto.randomBytes(20).toString('hex'),
            passwordResetExpires: new Date(authController.dateNow + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(authController.dateNow),
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
            await mailService.sendMail(email, 'Forgot Password', 'Dear', htmlTemplate);
            return res.status(200).json('send mail successfully');
        } catch (err) {
            console.log(err);
            next(err);
        }
        return res.status(500).json('An unexpected error occurred.');
    }
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        {   
            console.log(authController.dateNow);
            
            const tokenReset: string = req.params.tokenResetPassword.toString();
            const newPassword: string = req.body.password;
            try {
                await authService.findUserByToken(tokenReset).then(async (user) => {
                    if (!user) {
                        return res.status(400).json('token is not exist');
                    }
                    const hashedPassword: any = hashPassword(newPassword);
                    const userUpdate = {
                        password: hashedPassword.passwordHashed,
                        salt: hashedPassword.salt,
                        passwordResetToken: crypto.randomBytes(20).toString('hex'),
                        passwordResetExpires: new Date(authController.dateNow + 1000 * 60 * 60 * 24 * 7),
                    }
                    await authService.updateUserByToken(userUpdate, user.id);
                    return res.status(200).json('reset password successfully');
                });
            }
            catch (err) {
                next(err);
            }

        }
    }
}

export default new authController();