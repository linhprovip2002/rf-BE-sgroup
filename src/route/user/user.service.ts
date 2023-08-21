import poolKnex from "../../config/knex";
import { User } from '../../model/index'

class userService
{
    async getAllUser(): Promise<User[]>
    {
        return new Promise((resolve,reject) => {
            poolKnex('users').select().then((users) => {
                resolve(users);
            }).catch((err) => {
                reject(err);
            });
        }
        );
    }
    async getUserById(id: number): Promise<User>
    {
        return new Promise((resolve,reject) => {
            poolKnex('users').select().where('id',id).then((user) => {
                resolve(user[0]);
            }).catch((err) => {
                reject(err);
            });
        }
        );
    }
    async updateUserById(id, name, age, gender, email)
    {
        return new Promise((resolve,reject) => {
            poolKnex('users').where('id',id).update({
                name: name,
                age: age,
                gender: gender,
                email: email
            }).then((user) => {
                resolve(user);
            }
            ).catch((err) => {
                reject(err);
            }
            );
        }
        );
    }
    async deleteUserById(id: number)
    {
        return new Promise((resolve,reject) => {
            poolKnex('users').where('id',id).del().then((user) => {
                resolve(user);
            }
            ).catch((err) => {
                reject(err);
            }
            );
        });
    }
    async getAllUserPagination(page: number, limit: number): Promise<User[]>
    {   
        console.log("pagination");
        
        return new Promise((resolve,reject) => {
            poolKnex('users').select().limit(limit).offset((page - 1) * limit).then((users) => {
                resolve(users);
            }).catch((err) => {
                reject(err);
            });
        }
        );
    }
}
export default new userService();