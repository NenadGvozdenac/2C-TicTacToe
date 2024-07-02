import mongoose from "mongoose";

// dotenv
const url: string = "mongodb+srv://nenadgvozdenacsrb:sflopClas8CnPphb@cluster0.mccyqwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(url);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error");
        process.exit(1);
    }
}