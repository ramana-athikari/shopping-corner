import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;


// mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopping_corner");
// const db = mongoose.connection;

// db.on("error", (error)=>console.log("Error in database connection", error));
// db.on("open", ()=>console.log("Database is connected..."));

