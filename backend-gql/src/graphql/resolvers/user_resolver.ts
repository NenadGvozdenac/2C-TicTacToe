import User from '../../models/user';

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
        }
    }
}

export default userResolver;