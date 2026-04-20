import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRouts from "./src/routes/users-routs";
import profileRouts from "./src/routes/profile-routs";
import cors from "cors";


dotenv.config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json())
app.use(usersRouts);
app.use(profileRouts);

mongoose.connect(process.env.DATABASE_URL as string).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});