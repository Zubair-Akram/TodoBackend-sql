import express from "express";
import cors from "cors";
import { connection } from "./config/db.js";
import userRoutes from "./routes/User.js";
import noteRoutes from "./routes/note.js";

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests from this origin
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use(express.json());

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

const startServer = async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

startServer();
