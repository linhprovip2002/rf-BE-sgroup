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
    async findRole(id: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            poolKnex('role')
                .join('user_role', 'role.role_id', '=', 'user_role.role_id')
                .join('users', 'users.id', '=', 'user_role.user_id')
                .select('*')
                .where('users.id', id)
                .then((roles) => {
                    resolve(roles);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default new authService();