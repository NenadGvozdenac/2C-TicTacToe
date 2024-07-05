import mongoose from "mongoose";

import { secrets } from "./secrets";

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(secrets.MONGODB_URL);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error");
        process.exit(1);
    }
}