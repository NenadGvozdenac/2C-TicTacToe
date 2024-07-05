import User from '../../models/user';
import { verifyJwtToken } from '../../middleware/jwt_middleware';

const userResolver = {
    Query: {
        users: async () => {
            return await User.find();
        },

        user: async (_: any, { id }: { id: string }) => {
            return await User.findById(id);
        },

        userByUsername: async (_: any, { username }: { username: string }) => {
            return await User.findOne({ username });
        },

        decodeJwt: async (_: any, { token }: { token: string }) => {
            return verifyJwtToken(token);
        }
    }
}

export default userResolver;