import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json({message: "API is running!"})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
