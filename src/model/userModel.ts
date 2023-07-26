interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    username: string;
    password: string;
    salt: string;
    age: number;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
    createBy: number;
}
export default User;