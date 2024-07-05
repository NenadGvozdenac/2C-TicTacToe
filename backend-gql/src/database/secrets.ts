import dotenv from "dotenv";

dotenv.config();

export const secrets = {
    MONGODB_URL : process.env.MONGODB_URL as string,
    FE_URL : process.env.FE_URL as string,
    EXPRESS_PORT : process.env.EXPRESS_PORT as string,
    SOCKETIO_PORT : process.env.SOCKETIO_PORT as string,
    JWT_SECRET : process.env.JWT_SECRET as string
}