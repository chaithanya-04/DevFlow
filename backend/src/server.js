import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/user.js";


dns.setServers(["8.8.8.8", "1.1.1.1"]);
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req,res) => {
    res.json({
        success: true,
        message: "API is running!"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Port listening at http://localhost:${PORT}/`);
});
