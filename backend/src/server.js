import "dotenv/config";
import express from "express";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/ai.js";
import dashboardRoutes from "./routes/dashboard.js";
import healthRoutes from "./routes/health.js"


dns.setServers(["8.8.8.8", "1.1.1.1"]);
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (req,res) => {
    res.json({
        success: true,
        message: "API is running!"});
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Port listening at http://localhost:${PORT}/`);
});
