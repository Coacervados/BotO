import { User } from '@prisma/client';
import { UsersService } from './UsersService';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export class AuthService {
    static async register({
        name,
        email,
        password,
        phoneNumber,
    }: Pick<User, 'email' | 'name' | 'password' | 'phoneNumber'>) {
        const user = await UsersService.findByEmail(email);

        if (user) {
            return {
                jwt: undefined,
                error: { message: 'user already exists', code: 409 },
            };
        }

        const hasedPassword = await hash(password, 10);

        const newUser = await UsersService.create({
            name,
            email,
            password: hasedPassword,
            phoneNumber,
        });

        const jwt = sign(
            {
                id: newUser.id,
                name,
                email,
                phoneNumber,
            },
            process.env.JWT_SECRET!
        );

        return { jwt, error: undefined };
    }

    static async login({ email, password }: Pick<User, 'email' | 'password'>) {
        const user = await UsersService.findByEmail(email);

        if (!user) {
            return {
                error: { message: 'user could not be found', code: 404 },
                jwt: undefined,
            };
        }

        const passwordMatch = compare(password, user.password);

        if (!passwordMatch) {
            return { error: { message: 'wrong password', code: 400 } };
        }

        const jwt = sign(
            {
                id: user.id,
                name: user.name,
                email,
                phoneNumber: user.phoneNumber,
            },
            process.env.JWT_SECRET!
        );

        return { error: undefined, jwt };
    }
}
