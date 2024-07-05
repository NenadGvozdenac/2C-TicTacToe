import { readFileSync } from "fs";

const userSchema = readFileSync("./src/graphql/schemas/user_schema.graphql", "utf8");
const gameSchema = readFileSync("./src/graphql/schemas/game_schema.graphql", "utf8");
const moveSchema = readFileSync("./src/graphql/schemas/move_schema.graphql", "utf8");

const schemas = [userSchema, gameSchema, moveSchema];

export default schemas;