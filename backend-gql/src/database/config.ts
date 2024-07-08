import mongoose from "mongoose";

import { secrets } from './secrets';

export const connectToDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || secrets.MONGODB_URL;
        await mongoose.connect(mongoUri);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error", error);
        process.exit(1);
    }
}
