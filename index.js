import express from "express";
import "dotenv/config";
import connectDB from "./db/index.js";
import roomRoutes from "./routes/roomRoutes.js";
const app = express();

connectDB();
app.use(express.json());

app.use(roomRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
