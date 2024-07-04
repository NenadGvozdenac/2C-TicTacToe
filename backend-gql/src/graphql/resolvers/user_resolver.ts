import User from '../../models/user';

const userResolver = {
    Query: {
        users: async () => {
            return await User.find();
        },

        user: async (_: any, args: { id: string }) => {
            return await User.findById(args.id);
        },

        userByUsername: async (_: any, args: { username: string }) => {
            return await User.findOne({ username: args.username });
        }
    }
}

export default userResolver;