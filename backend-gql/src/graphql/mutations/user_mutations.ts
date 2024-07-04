import User from '../../models/user';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../../middleware/jwt_middleware';

const userMutations = {
    Mutation: {
        register: async (_: any, data: { username: string, password: string, confirmPassword: string }) => {
            const { username, password, confirmPassword } = data;

            if(password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const user = await User.findOne({ username });

            if(user) {
                throw new Error('Username already exists');
            }

            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                password: hashedPassword
            });

            await newUser.save();
            return user;
        },

        login: async (_: any, data: { username: string, password: string }) => {
            const { username, password } = data;

            const user = await User.findOne({ username });

            if(!user) {
                throw new Error('User does not exist');
            }

            const validPassword: boolean = await bcrypt.compare(password, user.password);

            if(!validPassword) {
                throw new Error('Invalid password');
            }

            return { message: 'Logged in successfully', token: generateJwtToken({ username: user.username, userid: user.id })}
        }
    }
}

export default userMutations;