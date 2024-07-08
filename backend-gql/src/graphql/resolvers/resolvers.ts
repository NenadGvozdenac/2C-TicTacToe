import userResolver from './user_resolver';
import gameResolver from './game_resolvers';
import moveResolver from './move_resolvers';
import { subscriptionResolvers } from './subscriptions_resolvers';

const resolvers = [userResolver, gameResolver, moveResolver, subscriptionResolvers];

export default resolvers;