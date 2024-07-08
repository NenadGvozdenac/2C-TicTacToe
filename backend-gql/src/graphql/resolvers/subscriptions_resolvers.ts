import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const subscriptionResolvers = {
    Subscription: {
        moveMade: {
            subscribe: (_: any, { gameId }: { gameId: string }) => {
                console.log('Subscribing to move made:', gameId);
                return pubsub.asyncIterator(`MOVE_MADE_${gameId}`);
            }
        },
        playersJoined: {
            subscribe: (_: any, { gameId }: { gameId: string }) => {
                console.log('Subscribing to player joined:', gameId);
                return pubsub.asyncIterator(`PLAYER_JOINED_${gameId}`);
            }
        },
        gameStarted: {
            subscribe: (_: any, { gameId }: { gameId: string }) => {
                console.log('Subscribing to game started:', gameId);
                return pubsub.asyncIterator(`GAME_STARTED_${gameId}`);
            }
        }
    }
}

export { pubsub, subscriptionResolvers };