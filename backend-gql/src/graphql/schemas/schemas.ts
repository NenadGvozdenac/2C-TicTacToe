import { readFileSync } from "fs";

const userSchema = readFileSync("./src/graphql/schemas/user_schema.graphql", "utf8");
const gameSchema = readFileSync("./src/graphql/schemas/game_schema.graphql", "utf8");
const moveSchema = readFileSync("./src/graphql/schemas/move_schema.graphql", "utf8");
const subscriptionsSchema = readFileSync("./src/graphql/schemas/subscriptions.graphql", "utf8");

const schemas = [userSchema, gameSchema, moveSchema, subscriptionsSchema];

export default schemas;