import { readFileSync } from "fs";

const userSchema = readFileSync("./src/graphql/schemas/user_schema.graphql", "utf8");
const gameSchema = readFileSync("./src/graphql/schemas/game_schema.graphql", "utf8");

const schemas = [userSchema, gameSchema];

export default schemas;