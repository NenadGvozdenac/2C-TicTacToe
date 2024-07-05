import userResolver from './user_resolver';
import gameResolver from './game_resolvers';
import moveResolver from './move_resolvers';

const resolvers = [userResolver, gameResolver, moveResolver];

export default resolvers;