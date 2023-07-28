import { User } from "../../model";
import poolKnex from "../../config/knex";
class authService {
    async getUserByUsername(username: string): Promise<User> {
        return new Promise((resolve, reject) => {
            poolKnex('users').select().where('username', username).then((user) => {
                resolve(user[0]);
            }
            ).catch((err) => {
                reject(err);
            }
            );
        });
    }
    async findRole(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            poolKnex('role')
                .select('role.role_name')
                .join('user_role', 'role.role_id', '=', 'user_role.role_id')
                .join('users', 'users.id', '=', 'user_role.user_id')
                .where('users.id', id)
                .then((roles) => {
                    resolve(roles);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    async createUser(newUser: User): Promise<void> {
        return new Promise((resolve, reject) => {
            poolKnex('users').insert(newUser).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
    async findUserByToken(token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            poolKnex('users').select().where('passwordResetToken', token).then((user) => {
                resolve(user[0]);
            }
            ).catch((err) => {
                reject(err);
            }
            );
        });
    }
    async updateUserByToken( newUser:Object , id : number): Promise<void> {
        return new Promise((resolve, reject) => {
            poolKnex('users').update(newUser).where('id', id).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

export default new authService();